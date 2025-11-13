import * as store from './store'

export interface BackupData {
  version: string
  timestamp: string
  userData: any[]
  aliases: any[]
  settings: any
  metadata: {
    userAgent: string
    url: string
    totalAliases: number
    totalAccounts: number
  }
}

export const createBackup = (): BackupData => {
  try {
    const userData = store.getAllAccount() || []
    const aliases = JSON.parse(localStorage.getItem('ddg_aliases') || '[]')
    const settings = JSON.parse(localStorage.getItem('ddg_settings') || '{}')
    
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      userData,
      aliases,
      settings,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.origin,
        totalAliases: aliases.length,
        totalAccounts: userData.length
      }
    }
  } catch (error) {
    console.error('[backup] create backup failed')
    throw new Error('failed to create backup')
  }
}

export const restoreBackup = (backupData: BackupData): boolean => {
  try {
    if (!backupData.version || !backupData.timestamp) {
      throw new Error('invalid backup format')
    }

    if (backupData.userData && Array.isArray(backupData.userData)) {
      store.clear()
      backupData.userData.forEach((user: any) => {
        store.addAccount(user)
      })
    }

    if (backupData.aliases && Array.isArray(backupData.aliases)) {
      localStorage.setItem('ddg_aliases', JSON.stringify(backupData.aliases))
    }

    if (backupData.settings && typeof backupData.settings === 'object') {
      localStorage.setItem('ddg_settings', JSON.stringify(backupData.settings))
    }

    return true
  } catch (error) {
    console.error('[backup] restore backup failed')
    return false
  }
}

export const downloadBackup = (backupData: BackupData, filename?: string): void => {
  try {
    const dataStr = JSON.stringify(backupData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `ddg-backup-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('[backup] download failed')
    throw new Error('failed to download backup')
  }
}

export const validateBackup = (data: any): data is BackupData => {
  try {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.version === 'string' &&
      typeof data.timestamp === 'string' &&
      Array.isArray(data.userData) &&
      Array.isArray(data.aliases) &&
      typeof data.settings === 'object'
    )
  } catch {
    return false
  }
}

export const getBackupStats = (backupData: BackupData) => {
  return {
    version: backupData.version,
    created: new Date(backupData.timestamp).toLocaleString(),
    accounts: backupData.userData?.length || 0,
    aliases: backupData.aliases?.length || 0,
    hasSettings: Object.keys(backupData.settings || {}).length > 0
  }
}
