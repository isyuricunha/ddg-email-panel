import type { GetStaticProps, NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ChartBarIcon,
  EnvelopeIcon,
  RectangleStackIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'

interface AliasItem {
  id: string
  alias: string
  createdAt: string
  isActive: boolean
  usageCount: number
  description?: string
}

interface DashboardStats {
  totalAliases: number
  activeAliases: number
  inactiveAliases: number
  recentAliases: number
  oldestAlias: string | null
  newestAlias: string | null
  averagePerDay: number
}

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'accent-orange' }: {
  icon: any
  title: string
  value: string | number
  subtitle?: string
  color?: string
}) => (
  <div className="glass-effect rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-${color}/20`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-gray-100">{value}</p>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
)

const RecentAliasItem = ({ alias }: { alias: AliasItem }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-pure-darker border border-white/5 hover:border-white/10 transition-all duration-200">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-200 truncate">
        {alias.alias}@duck.com
      </p>
      <p className="text-xs text-gray-500">
        {new Date(alias.createdAt).toLocaleDateString()}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${alias.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
      <span className="text-xs text-gray-400">{alias.usageCount} uses</span>
    </div>
  </div>
)

const DashboardPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')
  const authData = useAuth(false)
  const userInfo = authData?.userInfo
  const loading = authData?.loading

  const [aliases, setAliases] = useState<AliasItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAliases: 0,
    activeAliases: 0,
    inactiveAliases: 0,
    recentAliases: 0,
    oldestAlias: null,
    newestAlias: null,
    averagePerDay: 0
  })

  useEffect(() => {
    if (userInfo) {
      loadAliasData()
    }
  }, [userInfo])

  const loadAliasData = () => {
    const savedAliases = localStorage.getItem('ddg_aliases')
    if (savedAliases) {
      try {
        const aliasData: AliasItem[] = JSON.parse(savedAliases)
        setAliases(aliasData)
        calculateStats(aliasData)
      } catch (error) {
        console.error('[dashboard] failed to load alias data')
      }
    }
  }

  const calculateStats = (aliasData: AliasItem[]) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const totalAliases = aliasData.length
    const activeAliases = aliasData.filter(a => a.isActive).length
    const inactiveAliases = totalAliases - activeAliases
    const recentAliases = aliasData.filter(a => new Date(a.createdAt) > sevenDaysAgo).length
    
    const sortedByDate = [...aliasData].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    const oldestAlias = sortedByDate[0]?.alias || null
    const newestAlias = sortedByDate[sortedByDate.length - 1]?.alias || null
    
    let averagePerDay = 0
    if (totalAliases > 0 && sortedByDate.length > 1) {
      const firstDate = new Date(sortedByDate[0].createdAt)
      const lastDate = new Date(sortedByDate[sortedByDate.length - 1].createdAt)
      const daysDiff = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      averagePerDay = Math.round((totalAliases / daysDiff) * 100) / 100
    }

    setStats({
      totalAliases,
      activeAliases,
      inactiveAliases,
      recentAliases,
      oldestAlias,
      newestAlias,
      averagePerDay
    })
  }

  const getActivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split('T')[0],
        count: aliases.filter(alias => 
          alias.createdAt.split('T')[0] === date.toISOString().split('T')[0]
        ).length
      }
    }).reverse()

    const maxCount = Math.max(...last7Days.map(d => d.count), 1)
    
    return last7Days.map(day => ({
      ...day,
      height: Math.max(4, (day.count / maxCount) * 40)
    }))
  }

  if (loading) {
    return (
      <Layout title="dashboard" className="px-8 py-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('pages.dashboard.loadingDashboard')}</p>
        </div>
      </Layout>
    )
  }

  if (!userInfo) {
    return (
      <Layout title="dashboard" className="px-8 py-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{t('pages.dashboard.pleaseLogin')}</p>
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

  const activityData = getActivityData()
  const recentAliases = aliases.slice(0, 5)

  return (
    <Layout title="dashboard" className="px-8 py-6 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-yellow mb-2">
            {t('pages.dashboard.title')}
          </h1>
          <p className="text-gray-400">{t('pages.dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={RectangleStackIcon}
            title={t('pages.dashboard.totalAliases')}
            value={stats.totalAliases}
            subtitle={t('pages.dashboard.allTime')}
          />
          <StatCard
            icon={EyeIcon}
            title={t('pages.dashboard.activeAliases')}
            value={stats.activeAliases}
            subtitle={`${stats.inactiveAliases} ${t('pages.dashboard.inactive')}`}
            color="green-400"
          />
          <StatCard
            icon={ArrowTrendingUpIcon}
            title={t('pages.dashboard.recentAliases')}
            value={stats.recentAliases}
            subtitle={t('pages.dashboard.last7Days')}
            color="blue-400"
          />
          <StatCard
            icon={ChartBarIcon}
            title={t('pages.dashboard.avgPerDay')}
            value={stats.averagePerDay}
            subtitle={t('pages.dashboard.sinceFirstAlias')}
            color="purple-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <ChartBarIcon className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-gray-200">{t('pages.dashboard.activityChart')}</h2>
              <span className="text-sm text-gray-500">{t('pages.dashboard.last7Days')}</span>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-48">
              {activityData.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-accent-orange to-accent-yellow rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${day.height}px` }}
                  />
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-gray-500">{day.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <ClockIcon className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-lg font-semibold text-gray-200">{t('pages.dashboard.recentAliasesList')}</h2>
            </div>
            
            <div className="space-y-3">
              {recentAliases.length > 0 ? (
                recentAliases.map((alias) => (
                  <RecentAliasItem key={alias.id} alias={alias} />
                ))
              ) : (
                <div className="text-center py-8">
                  <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{t('pages.dashboard.noAliasesYet')}</p>
                  <button
                    onClick={() => router.push('/email')}
                    className="mt-2 text-accent-orange hover:text-accent-yellow text-sm underline"
                  >
                    {t('pages.dashboard.createFirstAlias')}
                  </button>
                </div>
              )}
            </div>

            {recentAliases.length > 0 && (
              <button
                onClick={() => router.push('/aliases')}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-300 hover:text-accent-yellow hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                {t('pages.dashboard.manageAliases')}
              </button>
            )}
          </div>
        </div>

        {stats.oldestAlias && stats.newestAlias && (
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-gray-200">{t('pages.dashboard.timeline')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-pure-darker rounded-lg border border-white/5">
                <p className="text-sm text-gray-400 mb-1">{t('pages.dashboard.firstAlias')}</p>
                <p className="text-lg font-semibold text-gray-200">{stats.oldestAlias}@duck.com</p>
              </div>
              <div className="text-center p-4 bg-pure-darker rounded-lg border border-white/5">
                <p className="text-sm text-gray-400 mb-1">{t('pages.dashboard.latestAlias')}</p>
                <p className="text-lg font-semibold text-gray-200">{stats.newestAlias}@duck.com</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/email')}
            className="px-6 py-3 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow text-white font-medium rounded-xl transition-all duration-200"
          >
            {t('pages.dashboard.generateNewAlias')}
          </button>
          <button
            onClick={() => router.push('/aliases')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-medium rounded-xl transition-all duration-200"
          >
            {t('pages.dashboard.manageAliases')}
          </button>
        </div>
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

export default DashboardPage
