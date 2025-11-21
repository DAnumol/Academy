import { createContext, useContext, useState } from 'react'
import LoadingSpinner from '@components/common/LoadingSpinner'

const LoadingContext = createContext()

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const showLoading = (text = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, loadingText }}>
      {children}
      {isLoading && <LoadingSpinner fullScreen text={loadingText} />}
    </LoadingContext.Provider>
  )
}