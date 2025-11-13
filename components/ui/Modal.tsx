import { Fragment, ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        <div className={`relative w-full ${sizeClasses[size]} glass-effect rounded-2xl border border-white/20 p-6 shadow-2xl`}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
          
          <div className="text-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Modal }
