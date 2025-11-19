import type { GetStaticProps, NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'
import { AliasCardSkeleton } from '../components/ui/skeleton'
import { StaggerContainer, StaggerItem } from '../components/ui/animation-wrapper'


interface AliasItem {
  id: string
  alias: string
  createdAt: string
  isActive: boolean
  usageCount: number
  description?: string
}

const AliasCard = ({ alias, onCopy, onToggle, onDelete, t }: {
  alias: AliasItem
  onCopy: (text: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  t: (key: string) => string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(`${alias.alias}@duck.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-effect rounded-xl p-4 border border-white/10 card-hover" role="article" aria-label={`Alias ${alias.alias}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-100 truncate">
            {alias.alias}@duck.com
          </p>
          {alias.description && (
            <p className="text-sm text-gray-400 mt-1">{alias.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className={`w-2 h-2 rounded-full ${alias.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-500">
            {alias.isActive ? t('pages.aliases.active') : t('pages.aliases.inactive')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(alias.createdAt).toLocaleDateString()}</span>
          </div>
          <span>{alias.usageCount} {t('pages.aliases.uses')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 flex-1"
        >
          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
          {copied ? t('pages.aliases.copied') : t('pages.aliases.copy')}
        </button>

        <button
          onClick={() => onToggle(alias.id)}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300"
        >
          {alias.isActive ? (
            <EyeSlashIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => onDelete(alias.id)}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 text-red-400"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const AliasesPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  const authData = useAuth(false)
  const userInfo = authData?.userInfo
  const loading = authData?.loading

  const [aliases, setAliases] = useState<AliasItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    if (userInfo) {
      loadAliases()
    }
  }, [userInfo])

  const loadAliases = () => {
    const savedAliases = localStorage.getItem('ddg_aliases')
    if (savedAliases) {
      try {
        setAliases(JSON.parse(savedAliases))
      } catch (_error) {
        console.error('[aliases] failed to load aliases')
        setAliases([])
      }
    }
  }

  const saveAliases = (newAliases: AliasItem[]) => {
    localStorage.setItem('ddg_aliases', JSON.stringify(newAliases))
    setAliases(newAliases)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleToggle = (id: string) => {
    const updatedAliases = aliases.map(alias =>
      alias.id === id ? { ...alias, isActive: !alias.isActive } : alias
    )
    saveAliases(updatedAliases)
  }

  const handleDelete = (id: string) => {
    const updatedAliases = aliases.filter(alias => alias.id !== id)
    saveAliases(updatedAliases)
  }

  const addCurrentAlias = () => {
    if (userInfo?.nextAlias) {
      const newAlias: AliasItem = {
        id: Date.now().toString(),
        alias: userInfo.nextAlias,
        createdAt: new Date().toISOString(),
        isActive: true,
        usageCount: 0,
        description: 'generated from email page'
      }

      const existingAliases = aliases.filter(a => a.alias !== userInfo.nextAlias)
      saveAliases([newAlias, ...existingAliases])
    }
  }

  const filteredAliases = aliases.filter(alias => {
    const matchesSearch = alias.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alias.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterActive === 'all' ||
      (filterActive === 'active' && alias.isActive) ||
      (filterActive === 'inactive' && !alias.isActive)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <Layout title="aliases" className="px-8 py-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
              {t('pages.aliases.title')}
            </h1>
            <p className="text-gray-400">{t('pages.aliases.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading aliases">
            {Array.from({ length: 6 }).map((_, i) => (
              <AliasCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (!userInfo) {
    return (
      <Layout title="aliases" className="px-8 py-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{t('pages.aliases.pleaseLoginAliases')}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-accent-orange hover:bg-accent-orange-light rounded-lg text-white font-medium transition-colors duration-200"
          >
            {t('pages.dashboard.goToLogin')}
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="aliases" className="px-8 py-6 max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            {t('pages.aliases.title')}
          </h1>
          <p className="text-gray-400">{t('pages.aliases.subtitle')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={t('pages.aliases.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 placeholder-gray-500 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-3 rounded-xl bg-pure-dark border border-white/10 text-gray-100 focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 focus:outline-none transition-all duration-200"
            >
              <option value="all">{t('pages.aliases.allAliases')}</option>
              <option value="active">{t('pages.aliases.activeOnly')}</option>
              <option value="inactive">{t('pages.aliases.inactiveOnly')}</option>
            </select>

            {userInfo.nextAlias && (
              <button
                onClick={addCurrentAlias}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow text-white font-medium rounded-xl transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                {t('pages.aliases.addCurrent')}
              </button>
            )}
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.05}>
          {filteredAliases.length > 0 ? (
            filteredAliases.map((alias) => (
              <StaggerItem key={alias.id}>
                <AliasCard
                  alias={alias}
                  onCopy={handleCopy}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  t={t}
                />
              </StaggerItem>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2">
                {searchTerm || filterActive !== 'all' ? t('pages.aliases.noAliasesFound') : t('pages.aliases.noAliasesSaved')}
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterActive !== 'all'
                  ? t('pages.aliases.tryAdjusting')
                  : t('pages.aliases.generateFromEmail')
                }
              </p>
            </div>
          )}
        </StaggerContainer>

        {filteredAliases.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            {t('pages.aliases.showingAliases', { count: filteredAliases.length, total: aliases.length })}
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

export default AliasesPage
