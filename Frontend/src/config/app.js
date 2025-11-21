/**
 * Application Configuration
 * Centralized configuration for the entire application
 */



export const APP_CONFIG = {
  // Application Info
  name: import.meta.env.VITE_APP_NAME || 'Enterprise Admin Dashboard',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'Modern enterprise-grade React admin dashboard',
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000
  },
  

  
  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false'
  },
  
  // Third-party Services
  services: {
    analytics: {
      googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
      mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN
    },
    errorReporting: {
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENVIRONMENT || 'development'
    },
    monitoring: {
      datadogApiKey: import.meta.env.VITE_DATADOG_API_KEY,
      newRelicLicenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY
    }
  },
  
  // UI Configuration
  ui: {
    theme: {
      defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'system',
      enableSystemTheme: import.meta.env.VITE_ENABLE_SYSTEM_THEME !== 'false'
    },
    animations: {
      enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false',
      reducedMotion: import.meta.env.VITE_REDUCED_MOTION === 'true'
    },
    layout: {
      sidebarCollapsed: import.meta.env.VITE_SIDEBAR_COLLAPSED === 'true',
      compactMode: import.meta.env.VITE_COMPACT_MODE === 'true'
    }
  },
  
  // Performance Configuration
  performance: {
    enableLazyLoading: import.meta.env.VITE_ENABLE_LAZY_LOADING !== 'false',
    enableCodeSplitting: import.meta.env.VITE_ENABLE_CODE_SPLITTING !== 'false',
    enableServiceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
    cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT) || 5 * 60 * 1000 // 5 minutes
  },
  
  // Development Configuration
  development: {
    enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info'
  },
  

  

}

// Environment-specific overrides
if (import.meta.env.DEV) {
  APP_CONFIG.development.enableDebugMode = true
  APP_CONFIG.development.logLevel = 'debug'
}

if (import.meta.env.PROD) {
  APP_CONFIG.development.enableDebugMode = false
  APP_CONFIG.development.enableMockData = false
}

export default APP_CONFIG