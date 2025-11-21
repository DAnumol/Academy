import { createContext, useContext, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      ...options
    })
  }, [])

  const showError = useCallback((message, options = {}) => {
    toast.error(message, {
      duration: 6000,
      ...options
    })
  }, [])

  const showWarning = useCallback((message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      duration: 5000,
      ...options
    })
  }, [])

  const showInfo = useCallback((message, options = {}) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      ...options
    })
  }, [])

  const showLoading = useCallback((message, options = {}) => {
    return toast.loading(message, options)
  }, [])

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId)
  }, [])

  const dismissAll = useCallback(() => {
    toast.dismiss()
  }, [])

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLoading,
      dismiss,
      dismissAll
    }}>
      {children}
    </NotificationContext.Provider>
  )
}