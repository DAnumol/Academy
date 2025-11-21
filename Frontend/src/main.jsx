import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ErrorBoundary from '@components/common/ErrorBoundary.jsx'
import { LoadingProvider } from './context/LoadingContext'
import { ErrorReportingProvider } from './context/ErrorReportingProvider'
import { NotificationProvider } from './context/NotificationProvider'
import { APP_CONFIG } from './config/app'

import { logger } from './services/loggerService'
import './styles/index.css'





// Log application startup
logger.info('Enterprise Dashboard starting', {
  version: APP_CONFIG.version,
  environment: APP_CONFIG.services?.errorReporting?.environment || 'development',
  features: APP_CONFIG.features
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: APP_CONFIG.api?.retryAttempts || 3,
      retryDelay: APP_CONFIG.api?.retryDelay || 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      onError: (error) => {
        logger.error('Query Error', error)
      }
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        logger.error('Mutation Error', error)
      }
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ErrorReportingProvider>
        <LoadingProvider>
          <NotificationProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--toast-bg)',
                        color: 'var(--toast-color)',
                        border: '1px solid var(--toast-border)',
                      },
                    }}
                    containerStyle={{
                      zIndex: 10001,
                    }}
                  />
              </BrowserRouter>
            </QueryClientProvider>
          </NotificationProvider>
        </LoadingProvider>
      </ErrorReportingProvider>
    </ErrorBoundary>
  </React.StrictMode>
)