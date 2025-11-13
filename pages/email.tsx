import type { GetStaticProps, NextPage } from 'next'
import type { UserInfo } from '../types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DocumentDuplicateIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { CgSpinner } from 'react-icons/cg'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'
import * as store from '../utils/store'
import generateAddresses from '../utils/generateAddresses'

const Loading = () => {
  return (
    <Layout
      title={`Loading`}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      <div role="status" aria-live="polite" aria-label="loading" className="flex flex-col items-center gap-4">
        <CgSpinner className="w-10 h-10 text-accent-orange animate-spin" aria-hidden="true" />
        <span className="text-gray-400 text-sm">loading...</span>
      </div>
    </Layout>
  )
}

const CopyBtn = ({ text, disabled = false }: { text: string; disabled?: boolean }) => {
  const { t } = useTranslation('')
  const [status, setStatus] = useState<boolean>(true)
  return (
    <button
      className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 glass-effect hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={!status || disabled}
      onClick={() => {
        setStatus(false)
        navigator.clipboard.writeText(text)
        setTimeout(() => {
          setStatus(true)
        }, 2000)
      }}
      aria-label={status ? t('Copy') : t('Copied')}
      aria-live="polite"
    >
      <DocumentDuplicateIcon className="w-4 mr-2" aria-hidden="true" />
      <span className="text-gray-300">{status ? t('Copy') : t('Copied')}</span>
    </button>
  )
}

const Email = ({ userInfo, setUserInfo }: { userInfo: UserInfo | null, setUserInfo: (info: UserInfo) => void }) => {
  const [generateBtnStatus, setGenerateBtnStatus] = useState<boolean>(false)
  const { t } = useTranslation('')
  const generateAddressesHandle = () => {
    setGenerateBtnStatus(true)
    generateAddresses(userInfo?.access_token || '')
      .then((res) => {
        const result = store.editAccount(0, { nextAlias: res.address })
        setUserInfo(result)
      })
      .catch((res) => {
        if (res?.status) {
          if (res?.status === 401) {
            toast.error(`${t('Generate failed')} - ${t('Unauthorized.1')}`)
          } else {
            toast.error(`${t('Generate failed')} - (${res.status} - ${res.statusText})`)
          }
        } else {
          toast(`${t('Error')} - ${res.message}`)
        }
      })
      .finally(() => {
        setGenerateBtnStatus(false)
      })
  }

  if (userInfo) {
    return (
      <Layout
        title={t('myemail')}
        className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center max-w-2xl mx-auto"
      >
        <div className="w-full space-y-6" role="main">
          <section className="glass-effect rounded-2xl p-6 border border-white/10" aria-labelledby="main-address">
            <p id="main-address" className="text-sm font-medium text-gray-400 mb-3">{t('Main Duck Address')}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xl font-semibold text-gray-100 break-all">{`${userInfo.username}@duck.com`}</p>
              <CopyBtn text={`${userInfo.username}@duck.com`} />
            </div>
          </section>
          
          <section className="glass-effect rounded-2xl p-6 border border-accent-orange/20" aria-labelledby="private-address">
            <p id="private-address" className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-3">
              {t('Private Duck Address')}
            </p>
            <div className="flex items-center justify-between gap-4">
              {userInfo?.nextAlias === '' ? (
                <div className="w-48 h-6 bg-gradient-to-r from-accent-orange/20 to-accent-yellow/20 rounded-lg animate-pulse" role="status" aria-label="loading address">
                  <span className="sr-only">loading...</span>
                </div>
              ) : (
                <p className="text-xl font-semibold text-gray-100 break-all">{`${userInfo?.nextAlias}@duck.com`}</p>
              )}
              <CopyBtn
                disabled={userInfo?.nextAlias === ''}
                text={`${userInfo.nextAlias}@duck.com`}
              />
            </div>
          </section>
          
          <button
            className="flex items-center justify-center w-full px-6 py-4 text-base font-semibold text-white rounded-xl transition-all duration-200 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow shadow-lg shadow-accent-orange/20 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:ring-offset-2 focus:ring-offset-pure-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-accent-orange disabled:hover:to-accent-yellow"
            disabled={generateBtnStatus}
            onClick={() => {
              generateAddressesHandle()
            }}
            aria-label={t('Generate Private Duck Address')}
            aria-busy={generateBtnStatus}
          >
            {generateBtnStatus ? (
              <CgSpinner className="w-5 h-5 mr-3 animate-spin" aria-hidden="true" />
            ) : (
              <SparklesIcon className="w-5 h-5 mr-3" aria-hidden="true" />
            )}
            {t('Generate Private Duck Address')}
          </button>
          
          <div className="space-y-3">
            <div className="alert-success rounded-xl text-sm" role="note" aria-label="tip">
              {t('For untrusted websites, Privacy Duck Addresses can hide your email identity')}
            </div>
            <div className="alert-warn rounded-xl text-sm" role="note" aria-label="privacy notice">
              {t('DDG Email Panel respects your privacy')}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <Layout
      title={t('Error')}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      {t('Some Error')}
    </Layout>
  )
}

const EmailPage: NextPage = () => {
  const authData = useAuth(false)
  
  if (!authData) {
    return <Loading />
  }

  const { loading, userInfo, setUserInfo } = authData

  if (loading) {
    return <Loading />
  }

  return <Email userInfo={userInfo} setUserInfo={setUserInfo} />
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default EmailPage
