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
      <div role="status" aria-live="polite" aria-label="loading">
        <CgSpinner className="w-8 h-8 text-slate-500 animate-spin" aria-hidden="true" />
        <span className="sr-only">loading...</span>
      </div>
    </Layout>
  )
}

const CopyBtn = ({ text, disabled = false }: { text: string; disabled?: boolean }) => {
  const { t } = useTranslation('')
  const [status, setStatus] = useState<boolean>(true)
  return (
    <button
      className="flex items-center justify-center h-8 px-2 py-1 text-sm text-white rounded-md shadow dark:text-slate-300 bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-400 hover:disabled:bg-slate-400 dark:hover:disabled:bg-slate-400 disabled:cursor-not-allowed"
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
      <DocumentDuplicateIcon className="w-4 mr-1" aria-hidden="true" />
      {status ? t('Copy') : t('Copied')}
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
        className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center max-w-xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-6" role="main">
          <section className="w-full" aria-labelledby="main-address">
            <p id="main-address" className="font-medium">{t('Main Duck Address')}</p>
            <div className="flex justify-between">
              <p className="text-xl">{`${userInfo.username}@duck.com`}</p>
              <CopyBtn text={`${userInfo.username}@duck.com`} />
            </div>
          </section>
          <section className="w-full" aria-labelledby="private-address">
            <p id="private-address" className="font-medium">{t('Private Duck Address')}</p>
            <div className="flex justify-between">
              {userInfo?.nextAlias === '' ? (
                <div className="w-48 h-3 max-w-sm my-3 mb-4 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" role="status" aria-label="loading address">
                  <span className="sr-only">loading...</span>
                </div>
              ) : (
                <p className="text-xl">{`${userInfo?.nextAlias}@duck.com`}</p>
              )}
              <CopyBtn
                disabled={userInfo?.nextAlias === ''}
                text={`${userInfo.nextAlias}@duck.com`}
              />
            </div>
          </section>
          <button
            className={`flex items-center justify-center bg-sky-600 hover:bg-sky-500 dark:text-slate-300 dark:bg-sky-700 dark:hover:bg-sky-600 shadow rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 hover:disabled:bg-slate-400 disabled:cursor-not-allowed`}
            disabled={generateBtnStatus}
            onClick={() => {
              generateAddressesHandle()
            }}
            aria-label={t('Generate Private Duck Address')}
            aria-busy={generateBtnStatus}
          >
            {generateBtnStatus ? (
              <CgSpinner className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
            ) : (
              <SparklesIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            )}
            {t('Generate Private Duck Address')}
          </button>
          <div className="m-0 alert-success" role="note" aria-label="tip">
            {t('For untrusted websites, Privacy Duck Addresses can hide your email identity')}
          </div>
          <div className="m-0 text-sm alert-warn" role="note" aria-label="privacy notice">
            {t('DDG Email Panel respects your privacy')}
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
