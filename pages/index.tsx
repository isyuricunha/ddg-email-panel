import type { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'

const Home: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')

  useEffect(() => {
    const checkAuth = () => {
      const lastUserId = localStorage.lastuser
      
      if (lastUserId) {
        const user = store.getAccount(Number(lastUserId))
        if (user) {
          router.push('/email')
          return
        }
      }
      
      const hasAnyAccount = store.getAccount(0)
      if (hasAnyAccount) {
        router.push('/email')
        return
      }
      
      router.push('/login')
    }

    checkAuth()
  }, [router])

  return (
    <Layout title="loading" className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">{t('loading')}</p>
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

export default Home
