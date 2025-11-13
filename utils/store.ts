import { UserInfo } from '../types'
import { secureGetItem, secureSetItem, secureClear } from './encryption'

export function getAccount(index: number) {
  const data = secureGetItem('user')
  if (!data) {
    console.error('[store] account not found')
    return null
  }
  return data[index]
}

export function getAllAccount() {
  const user = secureGetItem('user')
  if (!user) {
    console.error('[store] account not found')
    return null
  }
  return user
}

export function addAccount({
  access_token,
  cohort,
  remark,
  username,
  nextAlias,
}: {
  access_token: string
  cohort: string
  remark: string
  username: string
  nextAlias: string
}) {
  const userInfo = {
    access_token,
    cohort,
    remark,
    username,
    nextAlias,
  }
  const allUser = getAllAccount()
  if (!allUser) {
    secureSetItem('user', [userInfo])
    return 0
  } else {
    allUser.push(userInfo)
    secureSetItem('user', allUser)
    return allUser.length - 1
  }
}

export function editAccount(index: number, userInfo: UserInfo) {
  const allUser = getAllAccount()
  const user = allUser[index]
  if (!allUser[index]) {
    console.error('[store] account not found')
    return false
  }
  allUser[index] = { ...user, ...userInfo }
  secureSetItem('user', allUser)
  return allUser[index]
}

export function clear() {
  secureClear()
  return localStorage.clear()
}
