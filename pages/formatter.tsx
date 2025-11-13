import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { EnvelopeIcon, DocumentDuplicateIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'

const CopyButton = ({ text, label, variant = 'default' }: { text: string; label: string; variant?: 'default' | 'primary' }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const baseClasses = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
  const variantClasses = variant === 'primary' 
    ? "bg-white/10 hover:bg-white/20 text-black/80 border border-black/20" 
    : "glass-effect hover:bg-white/10 text-gray-300"
  
  return (
    <button
      onClick={handleCopy}
      className={`${baseClasses} ${variantClasses}`}
      aria-label={label}
    >
      <DocumentDuplicateIcon className="w-4 h-4 mr-2" aria-hidden="true" />
      <span>{copied ? 'copied!' : 'copy'}</span>
    </button>
  )
}

const FormatterPage: NextPage = () => {
  const { t } = useTranslation('')
  useAuth()
  
  const [toEmail, setToEmail] = useState('')
  const [fromAlias, setFromAlias] = useState('')
  
  const formatEmailString = () => {
    if (!toEmail || !fromAlias) return ''
    return `To Email: Receiver's email\n${toEmail}\nFrom Email: Your @duck alias\n${fromAlias}`
  }
  
  const generateDuckAlias = () => {
    if (!toEmail || !fromAlias) return ''
    const cleanToEmail = toEmail.replace('@', '_at_').replace(/\./g, '_')
    const cleanFromAlias = fromAlias.replace('@duck.com', '')
    return `${cleanToEmail}_${cleanFromAlias}@duck.com`
  }
  
  const generateMailtoLink = () => {
    if (!toEmail || !fromAlias) return ''
    return `mailto:${toEmail}?from=${fromAlias}`
  }

  return (
    <Layout
      title="Email Formatter"
      className="px-8 py-6 max-w-3xl mx-auto"
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            duck alias generator
          </h1>
          <p className="text-gray-400">create unique aliases for each recipient</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">recipient email</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">your duck username</label>
                <input
                  type="text"
                  value={fromAlias}
                  onChange={(e) => setFromAlias(e.target.value)}
                  placeholder="isyuricunha"
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
            
            {toEmail && fromAlias ? (
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-3">generated alias</p>
                  <div className="bg-gradient-to-r from-accent-orange to-accent-yellow rounded-xl p-6">
                    <p className="text-black font-mono text-2xl font-bold break-all mb-4">
                      {generateDuckAlias()}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <CopyButton text={generateDuckAlias()} label="copy alias" variant="primary" />
                      <a
                        href={`mailto:${toEmail}?from=${generateDuckAlias()}`}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 bg-black/20 hover:bg-black/30 border border-black/20"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        compose email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-t border-white/10">
                <EnvelopeIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">enter email details above to generate your duck alias</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>this creates a unique alias that forwards to your main duck address</p>
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

export default FormatterPage
