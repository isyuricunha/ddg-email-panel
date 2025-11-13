const STORAGE_KEY = 'ddg_secure_data'

function getEncryptionKey(): string {
  let key = localStorage.getItem('ddg_ek')
  if (!key) {
    key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    localStorage.setItem('ddg_ek', key)
  }
  return key
}

function simpleEncrypt(text: string): string {
  const key = getEncryptionKey()
  const encoded = new TextEncoder().encode(text)
  const keyBytes = key.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
  
  const encrypted = Array.from(encoded).map((byte, i) => {
    return byte ^ keyBytes[i % keyBytes.length]
  })
  
  return btoa(String.fromCharCode(...encrypted))
}

function simpleDecrypt(encrypted: string): string {
  try {
    const key = getEncryptionKey()
    const keyBytes = key.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
    const decoded = atob(encrypted).split('').map(c => c.charCodeAt(0))
    
    const decrypted = decoded.map((byte, i) => {
      return byte ^ keyBytes[i % keyBytes.length]
    })
    
    return new TextDecoder().decode(new Uint8Array(decrypted))
  } catch {
    return ''
  }
}

export function secureSetItem(key: string, value: any): void {
  try {
    const data = JSON.stringify(value)
    const encrypted = simpleEncrypt(data)
    localStorage.setItem(`${STORAGE_KEY}_${key}`, encrypted)
  } catch (error) {
    console.error('[encryption] failed to encrypt data:', error)
  }
}

export function secureGetItem(key: string): any {
  try {
    const encrypted = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    if (!encrypted) return null
    
    const decrypted = simpleDecrypt(encrypted)
    if (!decrypted) return null
    
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('[encryption] failed to decrypt data:', error)
    return null
  }
}

export function secureRemoveItem(key: string): void {
  localStorage.removeItem(`${STORAGE_KEY}_${key}`)
}

export function secureClear(): void {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_KEY))
  keys.forEach(key => localStorage.removeItem(key))
  localStorage.removeItem('ddg_ek')
}
