'use client'

import React, { useState, useEffect } from 'react'
import { X, Check, AlertTriangle, Info, Trash2 } from 'lucide-react'

export type PopoverType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface PopoverProps {
  type: PopoverType
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  onConfirm?: () => void
  onCancel?: () => void
  autoClose?: boolean
  duration?: number
}

const Popover: React.FC<PopoverProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  onConfirm,
  onCancel,
  autoClose = true,
  duration = 4000
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClose = React.useCallback(() => {
    setIsAnimating(false)
    setTimeout(onClose, 300) // Aguarda animação de saída
  }, [onClose])

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      
      if (autoClose && type !== 'confirm') {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)
        
        return () => clearTimeout(timer)
      }
    }
  }, [isVisible, autoClose, duration, type, handleClose])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    handleClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    handleClose()
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-6 h-6 text-green-600" />
      case 'error':
        return <X className="w-6 h-6 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />
      case 'confirm':
        return <Trash2 className="w-6 h-6 text-red-600" />
      default:
        return <Info className="w-6 h-6 text-gray-600" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'text-green-800',
          message: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'text-red-800',
          message: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          title: 'text-blue-800',
          message: 'text-blue-700'
        }
      case 'confirm':
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          title: 'text-gray-800',
          message: 'text-gray-700'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          title: 'text-gray-800',
          message: 'text-gray-700'
        }
    }
  }

  const colors = getColors()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button 
        className="absolute inset-0 bg-transparent transition-opacity duration-300"
        onClick={type !== 'confirm' ? handleClose : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && type !== 'confirm') {
            handleClose()
          }
        }}
        aria-label="Fechar popover"
      />
      
      {/* Popover */}
      <div 
        className={`
          relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl border-2 
          transform transition-all duration-300 ease-out
          ${colors.bg} ${colors.border}
          ${isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className={`text-lg font-bold ${colors.title}`}>
              {title}
            </h3>
          </div>
          
          {type !== 'confirm' && (
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-6">
          <p className={`text-sm leading-relaxed ${colors.message}`}>
            {message}
          </p>
        </div>

        {/* Botões de ação (apenas para confirmação) */}
        {type === 'confirm' && (
          <div className="flex justify-end space-x-3 px-6 pb-6 pt-2 border-t border-gray-100">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Confirmar
            </button>
          </div>
        )}

        {/* Barra de progresso (apenas para notificações com auto-close) */}
        {autoClose && type !== 'confirm' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
            <div 
              className={`h-full transition-all ease-linear ${
                (() => {
                  switch (type) {
                    case 'success':
                      return 'bg-green-500'
                    case 'error':
                      return 'bg-red-500'
                    case 'warning':
                      return 'bg-yellow-500'
                    default:
                      return 'bg-blue-500'
                  }
                })()
              }`}
              style={{
                width: isAnimating ? '0%' : '100%',
                transition: `width ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Popover
