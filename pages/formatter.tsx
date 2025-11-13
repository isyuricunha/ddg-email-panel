import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { EnvelopeIcon, DocumentDuplicateIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 glass-effect hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 disabled:opacity-40"
      aria-label={label}
    >
      <DocumentDuplicateIcon className="w-4 h-4 mr-2" aria-hidden="true" />
      <span className="text-gray-300">{copied ? 'copied!' : 'copy'}</span>
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
      className="px-8 py-6 max-w-4xl mx-auto"
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            duckduckgo send email formatter
          </h1>
          <p className="text-gray-400">format your duck addresses for easy sending</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <EnvelopeIcon className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-gray-200">email setup</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">to email</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="receiver@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">duck username</label>
                <input
                  type="text"
                  value={fromAlias}
                  onChange={(e) => setFromAlias(e.target.value)}
                  placeholder="isyuricunha"
                  className="w-full px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">just your username, without @duck.com</p>
              </div>
            </div>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 border border-accent-orange/20">
            <div className="flex items-center gap-3 mb-4">
              <PaperAirplaneIcon className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow">
                formatted output
              </h2>
            </div>
            
            {toEmail && fromAlias ? (
              <div className="space-y-4">
                <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                  <p className="text-sm font-medium text-gray-400 mb-2">email format template</p>
                  <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                    {formatEmailString()}
                  </pre>
                  <div className="mt-3 flex gap-2">
                    <CopyButton text={formatEmailString()} label="copy email format" />
                    <a
                      href={generateMailtoLink()}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow text-white shadow-lg shadow-accent-orange/20"
                    >
                      <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                      open in mail app
                    </a>
                  </div>
                </div>
                
                <div className="bg-pure-darker rounded-xl p-4 border border-accent-orange/10">
                  <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
                    generated duck alias
                  </p>
                  <div className="bg-pure-black rounded-lg p-3 border border-accent-orange/20">
                    <p className="text-accent-yellow font-mono text-lg break-all">
                      {generateDuckAlias()}
                    </p>
                  </div>
                  <div className="mt-3">
                    <CopyButton text={generateDuckAlias()} label="copy generated duck alias" />
                  </div>
                </div>
                
                <div className="bg-pure-darker rounded-xl p-4 border border-white/5">
                  <p className="text-sm font-medium text-gray-400 mb-2">original addresses</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">to: {toEmail}</span>
                      <CopyButton text={toEmail} label="copy to address" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">from: {fromAlias}</span>
                      <CopyButton text={fromAlias} label="copy from address" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">fill in the email details to see the formatted output</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-pure-darker rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">how to use</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• enter the recipient email address (e.g., exemplo@gmail.com)</p>
            <p>• type your duck username without @duck.com (e.g., isyuricunha)</p>
            <p>• the tool will generate a duck alias like: exemplo_at_gmail_com_isyuricunha@duck.com</p>
            <p>• copy the generated alias and use it as your "from" address when sending emails</p>
            <p>• this creates a unique alias for each recipient while protecting your main address</p>
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

export default FormatterPage
