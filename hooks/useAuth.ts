import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import type { UserInfo } from '../types'
import * as store from '../utils/store'

const AUTH_CACHE_KEY = 'auth_cache'
const CACHE_DURATION = 5 * 60 * 1000

interface AuthCache {
  userId: number
  userInfo: UserInfo
  timestamp: number
}

export function useAuth(redirectOnly = true) {
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const getCachedAuth = useCallback((): AuthCache | null => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY)
      if (!cached) return null
      
      const authCache: AuthCache = JSON.parse(cached)
      const isExpired = Date.now() - authCache.timestamp > CACHE_DURATION
      
      if (isExpired) {
        localStorage.removeItem(AUTH_CACHE_KEY)
        return null
      }
      
      return authCache
    } catch {
      localStorage.removeItem(AUTH_CACHE_KEY)
      return null
    }
  }, [])

  const setCachedAuth = useCallback((userId: number, userInfo: UserInfo) => {
    try {
      const authCache: AuthCache = {
        userId,
        userInfo,
        timestamp: Date.now()
      }
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(authCache))
    } catch {
      console.error('[auth] failed to cache auth data')
    }
  }, [])

  const loadUserData = useCallback((id: number) => {
    const cachedAuth = getCachedAuth()
    
    if (cachedAuth && cachedAuth.userId === id) {
      setUserId(cachedAuth.userId)
      setUserInfo(cachedAuth.userInfo)
      setLoading(false)
      return
    }

    const user = store.getAccount(id)
    
    if (user) {
      setUserId(id)
      setUserInfo(user)
      setLoading(false)
      localStorage.lastuser = id.toString()
      setCachedAuth(id, user)
    } else {
      setLoading(false)
      if (id !== 0 && store.getAccount(0)) {
        router.push({ query: { id: 0 } })
      } else {
        router.push('/login')
      }
    }
  }, [router, getCachedAuth, setCachedAuth])

  const updateUserInfo = useCallback((newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo)
    if (userId !== null) {
      setCachedAuth(userId, newUserInfo)
    }
  }, [userId, setCachedAuth])

  useEffect(() => {
    const { id } = router.query
    
    if (!id && localStorage.lastuser) {
      const lastUserId = Number(localStorage.lastuser)
      router.push({ query: { id: lastUserId } })
      return
    }

    if (id) {
      loadUserData(Number(id))
    }
  }, [router.query.id, loadUserData])

  const authData = useMemo(() => ({
    userId,
    userInfo,
    loading,
    setUserInfo: updateUserInfo
  }), [userId, userInfo, loading, updateUserInfo])

  if (redirectOnly) {
    return null
  }

  return authData
}
