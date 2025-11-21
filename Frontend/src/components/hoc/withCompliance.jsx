import { useEffect } from 'react'
import { useCompliance } from '@hooks/useCompliance'

const withCompliance = (WrappedComponent, complianceRules = {}) => {
  const ComplianceComponent = (props) => {
    const { 
      maskSensitiveData, 
      checkConsent,
      logAuditEvent 
    } = useCompliance()

    useEffect(() => {
      // Log component access for audit trail
      logAuditEvent('component_access', {
        component: WrappedComponent.name,
        timestamp: new Date().toISOString(),
        user: props.user?.id
      })
    }, [logAuditEvent, props.user?.id])

    // Check GDPR consent if required
    useEffect(() => {
      if (complianceRules.requiresConsent) {
        checkConsent()
      }
    }, [checkConsent, complianceRules.requiresConsent])

    // Mask sensitive data in props
    const maskedProps = complianceRules.maskData 
      ? maskSensitiveData(props, complianceRules.maskData)
      : props

    return <WrappedComponent {...maskedProps} />
  }

  ComplianceComponent.displayName = `withCompliance(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return ComplianceComponent
}

export default withCompliance