import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const getButtonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pure-black disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange-light hover:to-accent-yellow text-white shadow-lg shadow-accent-orange/20 focus:ring-accent-orange/50',
    secondary: 'bg-white/10 hover:bg-white/20 text-gray-300 focus:ring-white/50',
    outline: 'border border-white/20 hover:border-white/40 text-gray-300 hover:bg-white/5 focus:ring-white/50',
    ghost: 'hover:bg-white/10 text-gray-300 focus:ring-white/50',
    danger: 'bg-red-600/80 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-500/50',
    success: 'bg-green-600/80 hover:bg-green-500 text-white shadow-lg shadow-green-600/20 focus:ring-green-500/50',
  }
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    xl: 'h-12 px-8 text-base',
  }
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const buttonClasses = `${getButtonClasses(variant, size)} ${className}`
    
    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
