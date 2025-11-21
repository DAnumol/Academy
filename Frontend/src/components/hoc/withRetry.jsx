import { useState, useCallback } from 'react'
import { logger } from '@/services/loggerService'

const withRetry = (WrappedComponent, retryOptions = {}) => {
  const RetryComponent = (props) => {
    const [retryCount, setRetryCount] = useState(0)
    const [error, setError] = useState(null)
    const [isRetrying, setIsRetrying] = useState(false)

    const maxRetries = retryOptions.maxRetries || 3
    const retryDelay = retryOptions.retryDelay || 1000
    const exponentialBackoff = retryOptions.exponentialBackoff || true

    const handleRetry = useCallback(async () => {
      if (retryCount >= maxRetries) {
        logger.error('Max retries exceeded', {
          component: WrappedComponent.name,
          retryCount,
          maxRetries,
          error
        })
        return
      }

      setIsRetrying(true)
      setRetryCount(prev => prev + 1)

      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, retryCount)
        : retryDelay

      logger.info('Retrying component', {
        component: WrappedComponent.name,
        attempt: retryCount + 1,
        delay
      })

      await new Promise(resolve => setTimeout(resolve, delay))
      
      setError(null)
      setIsRetrying(false)
    }, [retryCount, error, maxRetries, retryDelay, exponentialBackoff])

    const handleError = useCallback((error) => {
      setError(error)
      logger.warn('Component error, preparing retry', {
        component: WrappedComponent.name,
        error: error.message,
        retryCount
      })
    }, [retryCount])

    const handleRefresh = useCallback(() => {
      window.location.reload()
    }, [])

    if (error && retryCount < maxRetries) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    if (error && retryCount >= maxRetries) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to load component
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Maximum retry attempts exceeded. Please refresh the page or contact support.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    try {
      return <WrappedComponent {...props} onError={handleError} />
    } catch (err) {
      handleError(err)
      return null
    }
  }

  RetryComponent.displayName = `withRetry(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return RetryComponent
}

export default withRetry