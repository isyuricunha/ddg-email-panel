import { cn } from '../../utils/cn'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
    animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton = ({
  className,
  variant = 'rectangular',
  animation = 'pulse'
}: SkeletonProps) => {
  const baseClasses = 'bg-gray-700/50'

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      aria-live="polite"
      aria-busy="true"
    />
  )
}

export const AliasCardSkeleton = () => (
  <div className="glass-effect rounded-xl p-4 border border-white/10 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton variant="circular" className="w-2 h-2 ml-4" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>

    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-10" />
    </div>
  </div>
)

export const StatCardSkeleton = () => (
  <div className="glass-effect rounded-xl p-6 border border-white/10">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="circular" className="w-12 h-12" />
      <Skeleton className="h-8 w-20" />
    </div>
    <Skeleton className="h-6 w-32 mb-2" />
    <Skeleton className="h-4 w-24" />
  </div>
)

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 py-3 border-b border-white/5">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-1/6" />
    <Skeleton className="h-4 w-1/6" />
  </div>
)
