import React, { useMemo } from 'react'
import { useCacheStore } from '@/store/cacheStore'

const withCache = (WrappedComponent, cacheKey, dependencies = []) => {
  const CachedComponent = React.memo((props) => {
    const { getCache, setCache } = useCacheStore()
    
    const cacheKeyWithProps = useMemo(() => {
      const propKeys = dependencies.length > 0 
        ? dependencies.map(dep => props[dep]).join('-')
        : JSON.stringify(props)
      return `${cacheKey}-${propKeys}`
    }, [props, ...dependencies])

    const cachedResult = useMemo(() => {
      const cached = getCache(cacheKeyWithProps)
      if (cached && !cached.expired) {
        return cached.data
      }
      return null
    }, [cacheKeyWithProps])

    const memoizedComponent = useMemo(() => {
      if (cachedResult) {
        return cachedResult
      }

      const result = <WrappedComponent {...props} />
      
      // Cache the result for 5 minutes by default
      setCache(cacheKeyWithProps, result, 5 * 60 * 1000)
      
      return result
    }, [props, cachedResult])

    return memoizedComponent
  }, (prevProps, nextProps) => {
    // Custom comparison for dependencies
    if (dependencies.length > 0) {
      return dependencies.every(dep => prevProps[dep] === nextProps[dep])
    }
    
    // Shallow comparison for all props
    const prevKeys = Object.keys(prevProps)
    const nextKeys = Object.keys(nextProps)
    
    if (prevKeys.length !== nextKeys.length) return false
    
    return prevKeys.every(key => prevProps[key] === nextProps[key])
  })

  CachedComponent.displayName = `withCache(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return CachedComponent
}

export default withCache