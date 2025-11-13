import { InputHTMLAttributes, forwardRef } from 'react'

type InputVariant = 'default' | 'error' | 'success'
type InputSize = 'sm' | 'md' | 'lg'

const getInputClasses = (variant: InputVariant = 'default', size: InputSize = 'md') => {
  const baseClasses = 'block w-full rounded-xl border bg-pure-dark text-gray-100 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2'
  
  const variantClasses = {
    default: 'border-white/10 focus:border-accent-orange/50 focus:ring-accent-orange/30',
    error: 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30',
    success: 'border-green-500/50 focus:border-green-500 focus:ring-green-500/30',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base',
  }
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', size = 'md', error, leftIcon, rightIcon, ...props }, ref) => {
    const inputVariant = error ? 'error' : variant
    const inputClasses = `${getInputClasses(inputVariant, size)} ${className}`
    
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="w-5 h-5 text-gray-500">
                {leftIcon}
              </div>
            </div>
          )}
          <input
            ref={ref}
            className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="w-5 h-5 text-gray-500">
                {rightIcon}
              </div>
            </div>
          )}
          {error && (
            <p className="mt-1 text-sm text-red-400">{error}</p>
          )}
        </div>
      )
    }
    
    return (
      <div>
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
