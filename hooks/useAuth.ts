import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { UserInfo } from '../types'
import * as store from '../utils/store'

export function useAuth(redirectOnly = true) {
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { id } = router.query
    
    if (!id && localStorage.lastuser) {
      router.push({
        query: {
          id: Number(localStorage.lastuser),
        },
      })
      return
    }

    const user = store.getAccount(Number(id))
    
    if (user) {
      setUserId(Number(id))
      setUserInfo(user)
      setLoading(false)
      localStorage.lastuser = id
    } else if (!user) {
      if (Number(id) !== 0 && store.getAccount(0)) {
        router.push({
          query: { id: 0 },
        })
      } else {
        router.push('/login')
      }
    }
  }, [router])

  if (redirectOnly) {
    return null
  }

  return { userId, userInfo, loading, setUserInfo }
}
