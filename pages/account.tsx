import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'
import * as store from '../utils/store'

const EmailPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  useAuth()

  return (
    <Layout
      title={t('nav.account')}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8 max-w-md">
        <div className="glass-effect rounded-2xl p-8 border border-white/10 text-center">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            {t('Coming soon')}
          </p>
          <p className="text-gray-400 text-sm">more features on the way</p>
        </div>
        
        <button
          className="flex items-center justify-center px-6 py-3 font-medium text-white rounded-xl transition-all duration-200 bg-red-600/80 hover:bg-red-500 shadow-lg shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-pure-black disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EmailPage
