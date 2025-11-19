import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useReducedMotion } from '../../hooks/use-reduced-motion'

interface AnimationWrapperProps {
    children: React.ReactNode
    className?: string
    variant?: 'fade' | 'slide' | 'scale' | 'slideUp'
    delay?: number
    duration?: number
}

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }
}

export const AnimationWrapper = ({
  children,
  className,
  variant = 'fade',
  delay = 0,
  duration = 0.3
}: AnimationWrapperProps) => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants[variant]}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
    staggerDelay?: number
}

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1
}: StaggerContainerProps) => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  )
}

export { AnimatePresence }
