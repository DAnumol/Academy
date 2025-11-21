import withAuth from './withAuth'
import withErrorBoundary from './withErrorBoundary'
import withLoading from './withLoading'
import withAnalytics from './withAnalytics'
import withTheme from './withTheme'
import withInternationalization from './withInternationalization'
import withCompliance from './withCompliance'
import withPerformanceMonitor from './withPerformanceMonitor'
import withGlobalErrorHandler from './withGlobalErrorHandler'
import withCache from './withCache'
import withRetry from './withRetry'

/**
 * Enterprise HOC Composer
 * Automatically applies all enterprise-level HOCs to components
 * Changes in this file affect the entire application
 */
const withEnterpriseFeatures = (
  WrappedComponent, 
  options = {}
) => {
  const {
    requireAuth = false,
    enableCache = false,
    cacheKey = null,
    cacheDependencies = [],
    enableRetry = false,
    retryOptions = {},
    enablePerformanceMonitor = true,
    performanceOptions = {},
    complianceRules = {},
    analyticsOptions = {},
    skipGlobalError = false
  } = options

  let EnhancedComponent = WrappedComponent

  // Apply HOCs in order of importance
  
  // 1. Global Error Handler (outermost)
  if (!skipGlobalError) {
    EnhancedComponent = withGlobalErrorHandler(EnhancedComponent)
  }

  // 2. Authentication (if required)
  if (requireAuth) {
    EnhancedComponent = withAuth(EnhancedComponent)
  }

  // 3. Error Boundary
  EnhancedComponent = withErrorBoundary(EnhancedComponent)

  // 4. Retry Logic
  if (enableRetry) {
    EnhancedComponent = withRetry(EnhancedComponent, retryOptions)
  }

  // 5. Performance Monitoring
  if (enablePerformanceMonitor) {
    EnhancedComponent = withPerformanceMonitor(EnhancedComponent, performanceOptions)
  }

  // 6. Caching
  if (enableCache && cacheKey) {
    EnhancedComponent = withCache(EnhancedComponent, cacheKey, cacheDependencies)
  }

  // 7. Compliance (GDPR, etc.)
  if (Object.keys(complianceRules).length > 0) {
    EnhancedComponent = withCompliance(EnhancedComponent, complianceRules)
  }

  // 8. Analytics
  EnhancedComponent = withAnalytics(EnhancedComponent, analyticsOptions)

  // 9. Internationalization
  EnhancedComponent = withInternationalization(EnhancedComponent)

  // 10. Theme
  EnhancedComponent = withTheme(EnhancedComponent)

  // 11. Loading (innermost)
  EnhancedComponent = withLoading(EnhancedComponent)

  // Set display name for debugging
  EnhancedComponent.displayName = `withEnterpriseFeatures(${WrappedComponent.displayName || WrappedComponent.name})`

  return EnhancedComponent
}

/**
 * Preset configurations for different component types
 */
export const withPageFeatures = (WrappedComponent) => {
  return withEnterpriseFeatures(WrappedComponent, {
    requireAuth: true,
    enableCache: true,
    cacheKey: `page-${WrappedComponent.name}`,
    enableRetry: true,
    retryOptions: { maxRetries: 2, retryDelay: 1000 },
    enablePerformanceMonitor: true,
    complianceRules: { requiresConsent: true }
  })
}

export const withComponentFeatures = (WrappedComponent) => {
  return withEnterpriseFeatures(WrappedComponent, {
    enableCache: false,
    enableRetry: false,
    enablePerformanceMonitor: true,
    performanceOptions: { slowThreshold: 50 }
  })
}

export const withFormFeatures = (WrappedComponent) => {
  return withEnterpriseFeatures(WrappedComponent, {
    enableRetry: true,
    retryOptions: { maxRetries: 1 },
    complianceRules: { 
      requiresConsent: true,
      maskData: [
        { field: 'email', type: 'email' },
        { field: 'phone', type: 'phone' }
      ]
    }
  })
}

export const withModalFeatures = (WrappedComponent) => {
  return withEnterpriseFeatures(WrappedComponent, {
    enableCache: true,
    cacheKey: `modal-${WrappedComponent.name}`,
    cacheDependencies: ['isOpen'],
    skipGlobalError: true // Modals handle their own errors
  })
}

export default withEnterpriseFeatures