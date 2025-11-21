import React, { useEffect, useRef } from 'react'
import { logger } from '@/services/loggerService'

const withPerformanceMonitor = (WrappedComponent, options = {}) => {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Unknown'
  
  const PerformanceMonitorComponent = React.memo((props) => {
    const renderStartTime = useRef(performance.now())
    const mountTime = useRef(null)

    useEffect(() => {
      mountTime.current = performance.now()
      const mountDuration = mountTime.current - renderStartTime.current

      // Log mount performance
      logger.logPerformance('component_mount', mountDuration, {
        component: componentName,
        props: Object.keys(props)
      })

      // Monitor for slow renders
      if (mountDuration > (options.slowThreshold || 100)) {
        logger.warn('Slow Component Mount', {
          component: componentName,
          duration: mountDuration,
          threshold: options.slowThreshold || 100
        })
      }

      return () => {
        const unmountTime = performance.now()
        const lifetimeDuration = unmountTime - mountTime.current

        logger.logPerformance('component_lifetime', lifetimeDuration, {
          component: componentName
        })
      }
    }, [])

    // Monitor re-renders
    useEffect(() => {
      const renderTime = performance.now() - renderStartTime.current
      
      if (renderTime > (options.rerenderThreshold || 16)) {
        logger.warn('Slow Re-render', {
          component: componentName,
          duration: renderTime,
          threshold: options.rerenderThreshold || 16
        })
      }
    })

    return <WrappedComponent {...props} />
  })

  PerformanceMonitorComponent.displayName = `withPerformanceMonitor(${componentName})`
  
  return PerformanceMonitorComponent
}

export default withPerformanceMonitor