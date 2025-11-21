/**
 * Enterprise-level optimizations for production applications
 */

import React from 'react'
import { APP_CONFIG } from '@config/app'

// Bundle optimization utilities
export const bundleOptimizations = {
  // Dynamic imports with error handling
  lazyImport: (importFn, fallback = null) => {
    return React.lazy(async () => {
      try {
        const module = await importFn()
        return module
      } catch (error) {
        console.error('Lazy import failed:', error)
        return fallback || { 
          default: () => React.createElement('div', { 
            className: 'error-fallback p-4 text-center text-red-600' 
          }, 'Component failed to load') 
        }
      }
    })
  },

  // Preload critical resources with validation
  preloadResource: (href, as = 'script', crossorigin = 'anonymous') => {
    if (typeof window !== 'undefined' && href) {
      // Validate URL to prevent SSRF
      try {
        const url = new URL(href, window.location.origin)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          console.warn('Invalid protocol for preload resource:', href)
          return
        }
        
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = url.href
        link.as = as
        if (crossorigin) link.crossOrigin = crossorigin
        document.head.appendChild(link)
      } catch (error) {
        console.warn('Invalid URL for preload resource:', href)
      }
    }
  },

  // Prefetch non-critical resources with validation
  prefetchResource: (href) => {
    if (typeof window !== 'undefined' && href) {
      try {
        const url = new URL(href, window.location.origin)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          console.warn('Invalid protocol for prefetch resource:', href)
          return
        }
        
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = url.href
        document.head.appendChild(link)
      } catch (error) {
        console.warn('Invalid URL for prefetch resource:', href)
      }
    }
  },

  // Code splitting by route
  splitByRoute: (routes) => {
    return routes.map(route => ({
      ...route,
      component: bundleOptimizations.lazyImport(route.import)
    }))
  }
}

// Memory management utilities
export const memoryOptimizations = {
  // Weak reference cache
  createWeakCache: () => {
    const cache = new WeakMap()
    return {
      get: (key) => cache.get(key),
      set: (key, value) => cache.set(key, value),
      has: (key) => cache.has(key),
      delete: (key) => cache.delete(key)
    }
  },

  // Memory usage monitor with validation
  monitorMemory: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      try {
        const memory = performance.memory
        return {
          used: Math.max(0, memory.usedJSHeapSize || 0),
          total: Math.max(0, memory.totalJSHeapSize || 0),
          limit: Math.max(0, memory.jsHeapSizeLimit || 0),
          usage: memory.jsHeapSizeLimit > 0 ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0
        }
      } catch (error) {
        return null
      }
    }
    return null
  },

  // Garbage collection hint
  requestGC: () => {
    if (typeof window !== 'undefined' && window.gc) {
      window.gc()
    }
  },

  // Clean up event listeners
  cleanupListeners: (element, events) => {
    events.forEach(({ event, handler }) => {
      element.removeEventListener(event, handler)
    })
  }
}

// Network optimization utilities
export const networkOptimizations = {
  // Request deduplication
  createRequestDeduplicator: () => {
    const pendingRequests = new Map()
    
    return async (key, requestFn) => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key)
      }
      
      const promise = requestFn()
      pendingRequests.set(key, promise)
      
      try {
        const result = await promise
        pendingRequests.delete(key)
        return result
      } catch (error) {
        pendingRequests.delete(key)
        throw error
      }
    }
  },

  // Request batching
  createRequestBatcher: (batchSize = 10, delay = 100) => {
    let batch = []
    let timeoutId = null
    
    return (request) => {
      return new Promise((resolve, reject) => {
        batch.push({ request, resolve, reject })
        
        if (batch.length >= batchSize) {
          processBatch()
        } else if (!timeoutId) {
          timeoutId = setTimeout(processBatch, delay)
        }
      })
    }
    
    function processBatch() {
      const currentBatch = batch
      batch = []
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      // Process batch requests
      Promise.allSettled(currentBatch.map(({ request }) => request()))
        .then(results => {
          results.forEach((result, index) => {
            const { resolve, reject } = currentBatch[index]
            if (result.status === 'fulfilled') {
              resolve(result.value)
            } else {
              reject(result.reason)
            }
          })
        })
    }
  },

  // Connection monitoring
  monitorConnection: () => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  },

  // Adaptive loading based on connection
  adaptiveLoad: (resources) => {
    const connection = networkOptimizations.monitorConnection()
    
    if (!connection) return resources
    
    // Reduce quality for slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return resources.filter(r => r.priority === 'high')
    }
    
    // Load all resources for fast connections
    if (connection.effectiveType === '4g') {
      return resources
    }
    
    // Load medium and high priority for 3g
    return resources.filter(r => r.priority !== 'low')
  }
}

// Rendering optimizations
export const renderOptimizations = {
  // Virtual scrolling implementation
  createVirtualScroller: (itemHeight, containerHeight, overscan = 5) => {
    return {
      getVisibleRange: (scrollTop, itemCount) => {
        const visibleStart = Math.floor(scrollTop / itemHeight)
        const visibleEnd = Math.min(
          visibleStart + Math.ceil(containerHeight / itemHeight),
          itemCount - 1
        )
        
        return {
          start: Math.max(0, visibleStart - overscan),
          end: Math.min(itemCount - 1, visibleEnd + overscan)
        }
      },
      
      getTotalHeight: (itemCount) => itemCount * itemHeight,
      
      getItemStyle: (index) => ({
        position: 'absolute',
        top: index * itemHeight,
        height: itemHeight,
        width: '100%'
      })
    }
  },

  // Intersection observer for lazy loading
  createIntersectionObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options })
  },

  // Debounced resize observer
  createResizeObserver: (callback, debounceMs = 100) => {
    let timeoutId = null
    
    return new ResizeObserver((entries) => {
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        callback(entries)
      }, debounceMs)
    })
  },

  // Frame rate monitor with validation
  monitorFrameRate: (callback) => {
    if (typeof callback !== 'function') return
    
    let lastTime = performance.now()
    let frameCount = 0
    let animationId = null
    
    function tick(currentTime) {
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        try {
          callback(Math.max(0, Math.min(120, fps)))
        } catch (error) {
          console.warn('Frame rate callback error:', error)
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(tick)
    }
    
    animationId = requestAnimationFrame(tick)
    return () => animationId && cancelAnimationFrame(animationId)
  }
}

// Cache optimizations
export const cacheOptimizations = {
  // LRU Cache implementation
  createLRUCache: (maxSize = 100) => {
    const cache = new Map()
    
    return {
      get: (key) => {
        if (cache.has(key)) {
          const value = cache.get(key)
          cache.delete(key)
          cache.set(key, value)
          return value
        }
        return undefined
      },
      
      set: (key, value) => {
        if (cache.has(key)) {
          cache.delete(key)
        } else if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value
          cache.delete(firstKey)
        }
        cache.set(key, value)
      },
      
      has: (key) => cache.has(key),
      delete: (key) => cache.delete(key),
      clear: () => cache.clear(),
      size: () => cache.size
    }
  },

  // Time-based cache
  createTTLCache: (defaultTTL = 300000) => { // 5 minutes default
    const cache = new Map()
    
    return {
      get: (key) => {
        const item = cache.get(key)
        if (!item) return undefined
        
        if (Date.now() > item.expiry) {
          cache.delete(key)
          return undefined
        }
        
        return item.value
      },
      
      set: (key, value, ttl = defaultTTL) => {
        cache.set(key, {
          value,
          expiry: Date.now() + ttl
        })
      },
      
      has: (key) => {
        const item = cache.get(key)
        if (!item) return false
        
        if (Date.now() > item.expiry) {
          cache.delete(key)
          return false
        }
        
        return true
      },
      
      delete: (key) => cache.delete(key),
      clear: () => cache.clear(),
      cleanup: () => {
        const now = Date.now()
        for (const [key, item] of cache.entries()) {
          if (now > item.expiry) {
            cache.delete(key)
          }
        }
      }
    }
  },

  // Service Worker cache strategies
  cacheStrategies: {
    cacheFirst: async (request, cacheName) => {
      try {
        // Validate request URL
        const url = new URL(request.url || request)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('Invalid protocol')
        }
        
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(request)
        
        if (cachedResponse) {
          return cachedResponse
        }
        
        const networkResponse = await fetch(request)
        if (networkResponse.ok && networkResponse.url.startsWith(url.origin)) {
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      } catch (error) {
        console.warn('Cache first strategy failed:', error)
        throw error
      }
    },
    
    networkFirst: async (request, cacheName) => {
      try {
        const url = new URL(request.url || request)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('Invalid protocol')
        }
        
        const cache = await caches.open(cacheName)
        
        try {
          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          const cachedResponse = await cache.match(request)
          if (cachedResponse) {
            return cachedResponse
          }
          throw error
        }
      } catch (error) {
        console.warn('Network first strategy failed:', error)
        throw error
      }
    },
    
    staleWhileRevalidate: async (request, cacheName) => {
      try {
        const url = new URL(request.url || request)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('Invalid protocol')
        }
        
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(request)
        
        const networkResponsePromise = fetch(request).then(response => {
          if (response.ok && response.url.startsWith(url.origin)) {
            cache.put(request, response.clone())
          }
          return response
        }).catch(error => {
          console.warn('Background fetch failed:', error)
          return null
        })
        
        return cachedResponse || networkResponsePromise
      } catch (error) {
        console.warn('Stale while revalidate strategy failed:', error)
        throw error
      }
    }
  }
}

// Performance monitoring
export const performanceOptimizations = {
  // Core Web Vitals measurement
  measureCoreWebVitals: () => {
    return new Promise((resolve) => {
      const vitals = {}
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })
      
      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          vitals.fid = entry.processingStart - entry.startTime
        })
      }).observe({ entryTypes: ['first-input'] })
      
      // Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        vitals.cls = clsValue
      }).observe({ entryTypes: ['layout-shift'] })
      
      // Return vitals after a delay to collect data
      setTimeout(() => resolve(vitals), 5000)
    })
  },

  // Resource timing analysis
  analyzeResourceTiming: () => {
    const resources = performance.getEntriesByType('resource')
    
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType,
      cached: resource.transferSize === 0 && resource.decodedBodySize > 0
    }))
  },

  // Long task detection
  detectLongTasks: (callback) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(callback)
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      return observer
    }
  },

  // Memory pressure detection
  detectMemoryPressure: (threshold = 0.8) => {
    const memory = memoryOptimizations.monitorMemory()
    if (memory && memory.usage > threshold * 100) {
      return {
        pressure: 'high',
        usage: memory.usage,
        recommendation: 'Consider reducing memory usage'
      }
    }
    return { pressure: 'normal', usage: memory?.usage || 0 }
  }
}

// Export all optimizations
export default {
  bundle: bundleOptimizations,
  memory: memoryOptimizations,
  network: networkOptimizations,
  render: renderOptimizations,
  cache: cacheOptimizations,
  performance: performanceOptimizations
}