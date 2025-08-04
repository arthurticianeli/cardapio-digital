'use client'

import { useState, useCallback } from 'react'
import { PopoverType } from '@/components/Popover'

interface PopoverState {
  isVisible: boolean
  type: PopoverType
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
}

const initialState: PopoverState = {
  isVisible: false,
  type: 'info',
  title: '',
  message: '',
}

export const usePopover = () => {
  const [popoverState, setPopoverState] = useState<PopoverState>(initialState)

  const showPopover = useCallback((
    type: PopoverType,
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    setPopoverState({
      isVisible: true,
      type,
      title,
      message,
      onConfirm,
      onCancel
    })
  }, [])

  const hidePopover = useCallback(() => {
    setPopoverState(prev => ({
      ...prev,
      isVisible: false
    }))
  }, [])

  // Métodos de conveniência para diferentes tipos de popover
  const showSuccess = useCallback((title: string, message: string) => {
    showPopover('success', title, message)
  }, [showPopover])

  const showError = useCallback((title: string, message: string) => {
    showPopover('error', title, message)
  }, [showPopover])

  const showWarning = useCallback((title: string, message: string) => {
    showPopover('warning', title, message)
  }, [showPopover])

  const showInfo = useCallback((title: string, message: string) => {
    showPopover('info', title, message)
  }, [showPopover])

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showPopover('confirm', title, message, onConfirm, onCancel)
  }, [showPopover])

  return {
    popoverState,
    showPopover,
    hidePopover,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  }
}
