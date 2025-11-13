import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import Nav, { NavSwitch } from './Nav'

export default function Layout({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string | undefined
  title: string
}) {
  const { t } = useTranslation('')
  return (
    <>
      <Head>
        <title>{title ? `${title} - DDG Email Panel` : 'DDG Email Panel'}</title>
        <meta
          property="og:title"
          content={title ? `${title} - DDG Email Panel` : 'DDG Email Panel'}
        />
        <meta property="og:description" content={t('DDG Email Introduction')} />
        <meta name="description" content={t('DDG Email Introduction')} />
      </Head>
      <div className="relative flex flex-row h-screen overflow-hidden bg-pure-black">
        <Nav />
        <main className="w-full overflow-auto bg-pure-black">
          <div className="flex items-center w-full px-6 h-16 bg-pure-darker/30 backdrop-blur-sm border-b border-white/5">
            <NavSwitch />
            <div className="ml-3 lg:hidden font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow">
              DDG Email Panel
            </div>
          </div>
          <div className={`px-8 py-6 ${className ? className : ''}`}>{children}</div>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass-effect border border-white/10 text-gray-100',
          style: {
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#eab308',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#000000',
            },
          },
        }}
      />
    </>
  )
}
