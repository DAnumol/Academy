// Performance Configuration for Enterprise Template
export const PERFORMANCE_CONFIG = {
  // Bundle optimization
  bundleAnalysis: {
    enabled: import.meta.env.VITE_BUNDLE_ANALYSIS === 'true',
    threshold: 250000, // 250KB warning threshold
  },

  // Code splitting thresholds
  codeSplitting: {
    chunkSizeWarning: 244000, // 244KB
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    minChunkSize: 20000, // 20KB
  },

  // Image optimization
  images: {
    formats: ['webp', 'avif', 'jpg', 'png'],
    quality: {
      webp: 80,
      avif: 75,
      jpg: 85,
      png: 90,
    },
    sizes: {
      thumbnail: 150,
      small: 300,
      medium: 600,
      large: 1200,
    },
  },

  // Virtual scrolling
  virtualScrolling: {
    itemHeight: 50,
    overscan: 5,
    threshold: 100, // Enable for lists > 100 items
  },

  // Caching strategies
  caching: {
    api: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    images: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    static: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },

  // Performance monitoring
  monitoring: {
    fcp: 1800, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100,  // First Input Delay (ms)
    cls: 0.1,  // Cumulative Layout Shift
    ttfb: 600, // Time to First Byte (ms)
  },

  // Memory management
  memory: {
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    gcThreshold: 0.8, // Trigger cleanup at 80% usage
  },

  // Network optimization
  network: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
    compression: true,
    http2: true,
  },

  // Animation performance
  animations: {
    reducedMotion: false,
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Lazy loading
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1,
    images: true,
    components: true,
  },

  // Service Worker
  serviceWorker: {
    enabled: import.meta.env.PROD,
    cacheFirst: ['images', 'fonts', 'static'],
    networkFirst: ['api', 'dynamic'],
    staleWhileRevalidate: ['css', 'js'],
  },
}

export default PERFORMANCE_CONFIG