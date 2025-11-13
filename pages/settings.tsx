import type { GetStaticProps, NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  CogIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  ClockIcon,
  BellIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'
import * as store from '../utils/store'
import { createBackup, restoreBackup, downloadBackup, validateBackup, getBackupStats } from '../utils/backup'

interface AppSettings {
  autoLogout: number
  theme: 'dark' | 'darker' | 'system'
  notifications: boolean
  autoBackup: boolean
  showUsageStats: boolean
  defaultAliasDescription: string
}

const SettingsPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  const authData = useAuth(false)
  const userInfo = authData?.userInfo
  const loading = authData?.loading

  const [settings, setSettings] = useState<AppSettings>({
    autoLogout: 30,
    theme: 'dark',
    notifications: true,
    autoBackup: false,
    showUsageStats: true,
    defaultAliasDescription: ''
  })

  const [exportData, setExportData] = useState<string>('')
  const [importData, setImportData] = useState<string>('')
  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('ddg_settings')
    if (savedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(savedSettings) })
      } catch (error) {
        console.error('[settings] failed to load settings')
      }
    }
  }

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    localStorage.setItem('ddg_settings', JSON.stringify(updatedSettings))
    setSettings(updatedSettings)
  }

  const handleExportData = () => {
    try {
      const backup = createBackup()
      const exportString = JSON.stringify(backup, null, 2)
      setExportData(exportString)
      setShowExport(true)
    } catch (error) {
      console.error('[settings] export failed')
    }
  }

  const handleImportData = () => {
    try {
      const importObj = JSON.parse(importData)
      
      if (!validateBackup(importObj)) {
        alert('invalid backup format. please check the data.')
        return
      }
      
      const success = restoreBackup(importObj)
      
      if (success) {
        setImportData('')
        setShowImport(false)
        alert('data imported successfully! page will reload.')
        router.reload()
      } else {
        alert('import failed. please try again.')
      }
    } catch (error) {
      console.error('[settings] import failed')
      alert('import failed. please check the data format.')
    }
  }

  const handleClearAllData = () => {
    if (confirm('are you sure? this will delete all your data permanently.')) {
      localStorage.clear()
      store.clear()
      router.push('/login')
    }
  }

  const downloadExport = () => {
    try {
      const backup = JSON.parse(exportData)
      downloadBackup(backup)
    } catch (error) {
      console.error('[settings] download failed')
    }
  }

  if (loading) {
    return (
      <Layout title="settings" className="px-8 py-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">loading settings...</p>
        </div>
      </Layout>
    )
  }

  if (!userInfo) {
    return (
      <Layout title="settings" className="px-8 py-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">please login to access settings</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-accent-orange hover:bg-accent-orange-light rounded-lg text-white font-medium transition-colors duration-200"
          >
            go to login
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="settings" className="px-8 py-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            settings
          </h1>
          <p className="text-gray-400">customize your experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <CogIcon className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-gray-200">preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  auto logout (minutes)
                </label>
                <select
                  value={settings.autoLogout}
                  onChange={(e) => saveSettings({ autoLogout: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>never</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => saveSettings({ theme: e.target.value as 'dark' | 'darker' | 'system' })}
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                >
                  <option value="dark">dark</option>
                  <option value="darker">darker</option>
                  <option value="system">system</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  default alias description
                </label>
                <input
                  type="text"
                  value={settings.defaultAliasDescription}
                  onChange={(e) => saveSettings({ defaultAliasDescription: e.target.value })}
                  placeholder="auto-generated alias"
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">notifications</span>
                  </div>
                  <button
                    onClick={() => saveSettings({ notifications: !settings.notifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.notifications ? 'bg-accent-orange' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">auto backup</span>
                  </div>
                  <button
                    onClick={() => saveSettings({ autoBackup: !settings.autoBackup })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.autoBackup ? 'bg-accent-orange' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">show usage stats</span>
                  </div>
                  <button
                    onClick={() => saveSettings({ showUsageStats: !settings.showUsageStats })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.showUsageStats ? 'bg-accent-orange' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.showUsageStats ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 border border-accent-orange/20">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow">
                data management
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-blue-600/80 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
              >
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                export data
              </button>

              <button
                onClick={() => setShowImport(!showImport)}
                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-green-600/80 hover:bg-green-500 shadow-lg shadow-green-600/20"
              >
                <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                import data
              </button>

              <button
                onClick={handleClearAllData}
                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-red-600/80 hover:bg-red-500 shadow-lg shadow-red-600/20"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                clear all data
              </button>
            </div>
          </div>
        </div>

        {showExport && (
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">export data</h3>
            <div className="space-y-4">
              <textarea
                value={exportData}
                readOnly
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={downloadExport}
                  className="px-6 py-2 bg-accent-orange hover:bg-accent-orange-light text-white font-medium rounded-lg transition-colors duration-200"
                >
                  download file
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(exportData)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-gray-300 font-medium rounded-lg transition-colors duration-200"
                >
                  copy to clipboard
                </button>
                <button
                  onClick={() => setShowExport(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  close
                </button>
              </div>
            </div>
          </div>
        )}

        {showImport && (
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">import data</h3>
            <div className="space-y-4">
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="paste your backup data here..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 font-mono text-sm resize-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleImportData}
                  disabled={!importData.trim()}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                >
                  import data
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default SettingsPage
