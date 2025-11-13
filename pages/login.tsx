import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/solid'
import { CgSpinner } from 'react-icons/cg'
import Layout from '../components/Layout/Layout'
import { USERNAME_REGEX } from '../lib/constants'
import fetch from '../utils/fetch'
import generateAddresses from '../utils/generateAddresses'
import * as store from '../utils/store'
import maskEmail from '../utils/maskEmail'

const usernameAtom = atom<string>('')
const otpAtom = atom<string>('')
const loadingAtom = atom<boolean>(false)
const stepAtom = atom<'EnterUsername' | 'EnterOtp'>('EnterUsername')
const loginMethodAtom = atom<'username' | 'token'>('username')

const otpRequest = (username: string) => {
  return fetch(`/api/auth/loginlink`, {
    method: 'POST',
    body: JSON.stringify({
      username,
    }),
  })
}

const loginRequest = (username: string, otp: string) => {
  return fetch(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      otp,
    }),
  })
}

const EnterUsername = () => {
  const { t } = useTranslation('')
  const [username, setUsername] = useAtom(usernameAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)
  const [, setLoginMethod] = useAtom(loginMethodAtom)

  const usernameHandleChange = (event: { target: { value: string } }) =>
    setUsername(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (username === '') {
      toast.error(t('Duck Address cannot be empty'))
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      toast.error(t('Duck Address can only contain letters and numbers'))
      return
    }
    setLoading(true)
    otpRequest(username)
      .then(() => {
        setLoginMethod('username')
        setStep('EnterOtp')
      })
      .catch((res) => {
        console.error('[login] send login link failed')
        if (res?.status) {
          toast.error(`${res.status} - ${res.statusText}`)
        } else {
          toast.error(`${res.message}`)
        }
        return
      })
      .finally(() => setLoading(false))
  }
  const continueUseTokenHandle = () => {
    if (username === '') {
      toast.error(t('Duck Address cannot be empty'))
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      toast.error(t('Duck Address can only contain letters and numbers'))
      return
    }
    setLoginMethod('token')
    setStep('EnterOtp')
  }
  return (
    <>
      <div className="text-center mb-8">
        <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-3">
          {t('Enter your Duck Address')}
        </h4>
        <p className="text-gray-400">{t('login tip')}</p>
      </div>
      <form onSubmit={continueHandle}>
        <div className="flex flex-col items-center w-full md:w-[500px] p-8 glass-effect rounded-2xl border border-white/10">
          {/* input */}
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={username}
              onChange={usernameHandleChange}
              placeholder={t('Duck Address')}
              className="block w-full rounded-xl bg-pure-dark border border-white/10 pl-11 pr-[100px] py-3 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-px">
              <span className="inline-flex items-center h-full px-4 text-gray-400 border-l border-white/10 bg-pure-darker rounded-r-xl text-sm">
                @duck.com
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all duration-200 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow shadow-lg shadow-accent-orange/20 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:ring-offset-2 focus:ring-offset-pure-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-accent-orange disabled:hover:to-accent-yellow"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('login')
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                continueUseTokenHandle()
              }}
              className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-gray-300 hover:text-accent-yellow hover:bg-white/5 rounded-xl transition-all duration-200"
            >
              {t('Login using Access Token')}
            </button>
          </div>
          <Link
            href="https://duckduckgo.com/email/start"
            className="mt-4 text-gray-400 hover:text-accent-yellow hover:underline underline-offset-2 transition-colors duration-200"
            target="_blank"
            passHref
            rel="noopener noreferrer"
          >
            {t('No Duck Address')}
          </Link>
        </div>
      </form>
    </>
  )
}

const EnterOtp = () => {
  const { t } = useTranslation('')
  const [username] = useAtom(usernameAtom)
  const [otp, setOtp] = useAtom(otpAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)
  const [loginMethod] = useAtom(loginMethodAtom)
  const router = useRouter()

  const otpHandleChange = (event: { target: { value: string } }) => setOtp(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (otp === '') {
      toast.error(t('One-time Passphrase cannot be empty'))
      return
    }
    setLoading(true)
    // using token
    if (loginMethod === 'token') {
      const user = {
        access_token: otp,
        cohort: '',
        email: '',
        username,
      }
      // generate alias
      generateAddresses(user.access_token)
        .then((res) => {
          const userIndex = store.addAccount({
            ...user,
            remark: maskEmail(user.email),
            nextAlias: res.address,
          })
          // redirect
          router.push(`/email/?id=${userIndex}`)
          toast.success(t('Login Success'))
        })
        .catch((res) => {
          console.error('[login] generate alias failed')
          toast.error(t('The access token cannot generate an alias'))
          setLoading(false)
          return
        })
      return
    }
    loginRequest(username, otp.trim())
      .then((res) => {
        const { user } = res as {
          user: {
            access_token: string
            cohort: string
            email: string
            username: string
          }
        }
        generateAddresses(user.access_token)
          .then((res) => {
            const userIndex = store.addAccount({
              ...user,
              remark: maskEmail(user.email),
              nextAlias: res.address,
            })
            // redirect
            router.push(`/email/?id=${userIndex}`)
          })
          .catch((res) => {
            console.error('[login] generate alias failed')
            const userIndex = store.addAccount({
              ...user,
              remark: maskEmail(user.email),
              nextAlias: '',
            })
            // redirect
            router.push(`/email/?id=${userIndex}`)
            return
          })
          .finally(() => {
            toast.success(t('Login Success'))
          })
      })
      .catch((res) => {
        console.error('[login] authentication failed')
        if (res?.status) {
          if (res?.status === 401) {
            toast.error(t('Unauthorized'))
          } else {
            toast.error(`${res.status} - ${res.statusText}`)
          }
        } else {
          toast.error(res.message)
        }
        return
      })
      .finally(() => setLoading(false))
  }
  return (
    <>
      <div className="text-center mb-8">
        <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-3">
          {loginMethod === 'username' ? t('Check your inbox') : t('Enter your Access Token')}
        </h4>
        <p className="text-gray-400">
          {loginMethod === 'username' ? (
            t(
              'DuckDuckGo One-time Passphrase has been sent to your email address, please enter it below and continue'
            )
          ) : (
            <Link
              className="text-accent-yellow hover:text-accent-orange underline underline-offset-2 transition-colors duration-200"
              href="https://bitwarden.com/help/generator/#tab-duckduckgo-3Uj911RtQsJD9OAhUuoKrz"
              target="_blank"
            >
              {t('How to obtain a Token')}
            </Link>
          )}
        </p>
      </div>
      <form onSubmit={continueHandle}>
        <div className="flex flex-col items-center w-full md:w-[500px] p-8 glass-effect rounded-2xl border border-white/10">
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <KeyIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              className="block w-full rounded-xl bg-pure-dark border border-white/10 pl-11 pr-4 py-3 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
              type="text"
              value={otp}
              onChange={otpHandleChange}
              placeholder={
                loginMethod === 'username'
                  ? t('Enter your one-time passphrase')
                  : t('Enter your Access Token')
              }
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all duration-200 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow shadow-lg shadow-accent-orange/20 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:ring-offset-2 focus:ring-offset-pure-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-accent-orange disabled:hover:to-accent-yellow"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('Continue')
              )}
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-gray-300 hover:text-accent-yellow hover:bg-white/5 rounded-xl transition-all duration-200"
              onClick={() => {
                setOtp('')
                setStep('EnterUsername')
              }}
            >
              {t('Back')}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

const LoginPage: NextPage = () => {
  const [step] = useAtom(stepAtom)
  const { t } = useTranslation('')
  if (step) {
    return (
      <Layout
        title={t('login')}
        className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
      >
        {step === 'EnterUsername' ? <EnterUsername /> : <EnterOtp />}
        <div className="mt-8 max-w-2xl">
          <div className="alert-warn rounded-xl text-sm text-center">
            {t('DDG Email Panel respects your privacy')}
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-pure-black">
      <div className="flex flex-col items-center gap-4">
        <CgSpinner className="w-10 h-10 text-accent-orange animate-spin" />
        <span className="text-gray-400 text-sm">loading...</span>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default LoginPage
