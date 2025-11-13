import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowRightOnRectangleIcon, UserIcon, CogIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'
import * as store from '../utils/store'

const AccountPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  const authData = useAuth(false)
  const userInfo = authData?.userInfo
  const loading = authData?.loading
  
  const [showTokens, setShowTokens] = useState(false)
  

  return (
    <Layout
      title={t('nav.account')}
      className="px-8 py-6 max-w-4xl mx-auto"
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            {t('pages.account.title')}
          </h1>
          <p className="text-gray-400">{t('pages.account.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-gray-200">{t('pages.account.profileInformation')}</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t('pages.account.loadingProfile')}</p>
              </div>
            ) : userInfo ? (
              <div className="space-y-3">
                <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                  <p className="text-sm font-medium text-gray-400 mb-1">{t('pages.account.username')}</p>
                  <p className="text-gray-200">{userInfo.username}</p>
                </div>
                <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                  <p className="text-sm font-medium text-gray-400 mb-1">{t('pages.account.mainAddress')}</p>
                  <p className="text-gray-200">{userInfo.username}@duck.com</p>
                </div>
                {userInfo.nextAlias && (
                  <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                    <p className="text-sm font-medium text-gray-400 mb-1">{t('pages.account.currentPrivateAlias')}</p>
                    <p className="text-gray-200">{userInfo.nextAlias}@duck.com</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-400 text-sm">{t('pages.account.noUserData')}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-2 text-accent-orange hover:text-accent-yellow text-sm underline"
                >
                  {t('pages.account.goToLoginAccount')}
                </button>
              </div>
            )}
          </div>
          
          <div className="glass-effect rounded-2xl p-6 border border-accent-orange/20">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow">
                {t('pages.account.securityPrivacy')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-400">{t('pages.account.accessTokens')}</p>
                  <button
                    onClick={() => setShowTokens(!showTokens)}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200"
                  >
                    {showTokens ? t('pages.account.hide') : t('pages.account.show')}
                  </button>
                </div>
                {showTokens && userInfo?.access_token ? (
                  <p className="text-gray-200 text-sm font-mono break-all">
                    {userInfo.access_token}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">••••••••••••••••••••</p>
                )}
              </div>
              
              <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                <p className="text-sm font-medium text-gray-400 mb-2">{t('pages.account.dataEncryption')}</p>
                <div className="flex items-center gap-2">
                  <KeyIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{t('pages.account.tokensEncrypted')}</span>
                </div>
              </div>
              
              <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                <p className="text-sm font-medium text-gray-400 mb-2">{t('pages.account.privacyStatus')}</p>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{t('pages.account.noTracking')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <CogIcon className="w-5 h-5 text-accent-orange" />
            <h2 className="text-lg font-semibold text-gray-200">{t('pages.account.accountActions')}</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center justify-center px-6 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-blue-600/80 hover:bg-blue-500 shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-pure-black"
              onClick={() => router.push('/email')}
            >
              <UserIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              {t('pages.account.manageAddresses')}
            </button>
            
            <button
              className="flex items-center justify-center px-6 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-purple-600/80 hover:bg-purple-500 shadow-lg shadow-purple-600/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-pure-black"
              onClick={() => router.push('/formatter')}
            >
              <CogIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              {t('pages.account.emailFormatter')}
            </button>
            
            <button
              className="flex items-center justify-center px-6 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-red-600/80 hover:bg-red-500 shadow-lg shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-pure-black"
              onClick={() => {
                store.clear()
                router.reload()
              }}
              aria-label={t('Log Out')}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              {t('Log Out')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default AccountPage
