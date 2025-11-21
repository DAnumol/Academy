import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useErrorReporting } from '@/context/ErrorReportingProvider'
import { logger } from '@/services/loggerService'

const ErrorFallback = ({ resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

const withGlobalErrorHandler = (WrappedComponent) => {
  const GlobalErrorHandlerComponent = (props) => {
    const { reportError } = useErrorReporting()

    const handleError = React.useCallback((error, errorInfo) => {
      logger.error('Global Error Caught', { error, errorInfo })
      reportError(error, { 
        component: WrappedComponent.name,
        errorInfo,
        timestamp: new Date().toISOString()
      })
    }, [reportError])

    const handleReset = React.useCallback(() => {
      window.location.reload()
    }, [])

    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleError}
        onReset={handleReset}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  GlobalErrorHandlerComponent.displayName = `withGlobalErrorHandler(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return GlobalErrorHandlerComponent
}

export default withGlobalErrorHandler