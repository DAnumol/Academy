import React from 'react'
import { useFeatureFlags } from '@hooks/useFeatureFlags'

const withFeatureFlag = (WrappedComponent, flagName, fallbackComponent = null) => {
  const FeatureFlagComponent = (props) => {
    const { isEnabled, loading } = useFeatureFlags(flagName)

    if (loading) {
      return <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
    }

    if (!isEnabled) {
      return fallbackComponent ? React.createElement(fallbackComponent, props) : null
    }

    return <WrappedComponent {...props} />
  }

  FeatureFlagComponent.displayName = `withFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return FeatureFlagComponent
}

export default withFeatureFlag