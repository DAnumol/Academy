import { withEnterpriseFeatures } from '@components/hoc/withEnterpriseFeatures'
import { APP_CONFIG } from '@config/app'

/**
 * Enterprise Wrapper Component
 * Automatically applies enterprise features based on configuration
 */
const EnterpriseWrapper = ({ children, component: Component, ...props }) => {
  // Get enterprise configuration
  const { enterprise } = APP_CONFIG
  
  // Determine HOC options based on enterprise config
  const enterpriseOptions = {
    requireAuth: true,
    enableCache: enterprise?.performance?.caching?.enabled || false,
    cacheKey: `enterprise-${Component?.name || 'component'}`,
    enableRetry: true,
    retryOptions: {
      maxRetries: 3,
      retryDelay: 1000
    },
    enablePerformanceMonitor: enterprise?.monitoring?.apm?.enabled || false,
    performanceOptions: {
      slowThreshold: 100,
      trackUserInteractions: true
    },
    complianceRules: {
      requiresConsent: enterprise?.security?.gdpr?.enabled || false,
      dataRetention: enterprise?.security?.gdpr?.dataRetention || 365,
      maskData: [
        { field: 'email', type: 'email' },
        { field: 'phone', type: 'phone' },
        { field: 'ssn', type: 'ssn' }
      ]
    },
    analyticsOptions: {
      trackPageViews: true,
      trackUserActions: true,
      respectDoNotTrack: true
    }
  }
  
  // If Component is provided, wrap it with enterprise features
  if (Component) {
    const EnhancedComponent = withEnterpriseFeatures(Component, enterpriseOptions)
    return <EnhancedComponent {...props} />
  }
  
  // Otherwise, just render children
  return <>{children}</>
}

/**
 * HOC version for easier component wrapping
 */
export const withEnterprise = (WrappedComponent, options = {}) => {
  const EnterpriseComponent = (props) => (
    <EnterpriseWrapper component={WrappedComponent} {...options} {...props} />
  )
  
  EnterpriseComponent.displayName = `withEnterprise(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return EnterpriseComponent
}

/**
 * Enterprise Page Wrapper
 * Specialized wrapper for page components
 */
export const EnterprisePageWrapper = ({ children, ...props }) => {
  const pageOptions = {
    requireAuth: true,
    enableCache: true,
    enableRetry: true,
    enablePerformanceMonitor: true,
    complianceRules: {
      requiresConsent: true,
      auditTrail: true
    }
  }
  
  return (
    <EnterpriseWrapper {...pageOptions} {...props}>
      {children}
    </EnterpriseWrapper>
  )
}

/**
 * Enterprise Form Wrapper
 * Specialized wrapper for form components
 */
export const EnterpriseFormWrapper = ({ children, ...props }) => {
  const formOptions = {
    enableRetry: true,
    retryOptions: { maxRetries: 1 },
    complianceRules: {
      requiresConsent: true,
      maskData: [
        { field: 'email', type: 'email' },
        { field: 'phone', type: 'phone' },
        { field: 'creditCard', type: 'creditCard' }
      ],
      validation: true
    },
    analyticsOptions: {
      trackFormSubmissions: true,
      trackFormErrors: true,
      trackFormAbandonment: true
    }
  }
  
  return (
    <EnterpriseWrapper {...formOptions} {...props}>
      {children}
    </EnterpriseWrapper>
  )
}

export default EnterpriseWrapper