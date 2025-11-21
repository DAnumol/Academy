import { createContext, useContext, useCallback } from 'react'


const ErrorReportingContext = createContext()

export const useErrorReporting = () => {
  const context = useContext(ErrorReportingContext)
  if (!context) {
    throw new Error('useErrorReporting must be used within ErrorReportingProvider')
  }
  return context
}

export const ErrorReportingProvider = ({ children }) => {
  const reportError = useCallback((error, errorInfo = {}) => {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error reported:', error, errorInfo)
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorInfo })
      // Example: LogRocket.captureException(error)
      
      // Custom error reporting
      fetch('/api/errors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...errorInfo
        })
      }).catch(console.error)
    }
  }, [])

  const reportWarning = useCallback((message, data = {}) => {
    console.warn('Warning reported:', message, data)
    
    if (import.meta.env.PROD) {
      // Send warnings to monitoring service
      fetch('/api/warnings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      }).catch(console.error)
    }
  }, [])

  return (
    <ErrorReportingContext.Provider value={{ reportError, reportWarning }}>
      {children}
    </ErrorReportingContext.Provider>
  )
}