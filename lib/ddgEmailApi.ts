import { DUCKDUCKGO_API_ENDPOINT, DUCKDUCKGO_API_USERAGENT } from './constants'

const endpoint = DUCKDUCKGO_API_ENDPOINT
const fetchInit = { headers: { 'User-Agent': DUCKDUCKGO_API_USERAGENT } }

export async function loginRequest(username: string) {
  return fetch(`${endpoint}/auth/loginlink?user=${username}`, fetchInit)
}

export async function login(username: string, otp: string) {
  otp = otp.trim().replace(/\s/g, '+')
  return fetch(`${endpoint}/auth/login?otp=${otp}&user=${username}`, fetchInit)
}

export async function getAccessToken(token: string) {
  return fetch(`${endpoint}/email/dashboard`, {
    ...fetchInit,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function generateAddresses(token: string) {
  return fetch(`${endpoint}/email/addresses`, {
    ...fetchInit,
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
