import { APP_CONFIG } from '@config/app'

class ErrorService {
  constructor() {
    this.errorQueue = []
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrorQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'promise',
        promise: event.promise
      })
    })
  }

  handleError(error, context = {}) {
    const errorData = this.formatError(error, context)
    
    if (APP_CONFIG.services?.errorReporting?.environment === 'development') {
      console.error('Error Service:', errorData)
    }

    if (this.isOnline && APP_CONFIG.services?.monitoring?.enableErrorTracking) {
      this.sendError(errorData)
    } else {
      this.queueError(errorData)
    }
  }

  formatError(error, context = {}) {
    return {
      message: error.message || 'Unknown error',
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      context,
      severity: this.determineSeverity(error, context)
    }
  }

  determineSeverity(error, context) {
    if (error.name === 'ChunkLoadError') return 'low'
    if (context.type === 'promise') return 'medium'
    if (error.message?.includes('Network')) return 'medium'
    return 'high'
  }

  async sendError(errorData) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      })
    } catch (err) {
      this.queueError(errorData)
    }
  }

  queueError(errorData) {
    this.errorQueue.push(errorData)
    
    // Limit queue size
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift()
    }
  }

  async flushErrorQueue() {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    try {
      await fetch('/api/errors/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ errors })
      })
    } catch (err) {
      // Re-queue errors if sending fails
      this.errorQueue.unshift(...errors)
    }
  }

  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('enterprise_user_data')
      return userData ? JSON.parse(userData).id : null
    } catch {
      return null
    }
  }

  getSessionId() {
    return sessionStorage.getItem('enterprise_session_id') || 'anonymous'
  }

  // Manual error reporting
  reportError(error, context = {}) {
    this.handleError(error, { ...context, manual: true })
  }

  // Performance monitoring
  reportPerformance(metric) {
    if (!APP_CONFIG.services?.monitoring?.enablePerformanceMonitoring) return

    const performanceData = {
      ...metric,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getCurrentUserId()
    }

    if (this.isOnline) {
      fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(performanceData)
      }).catch(() => {
        // Silently fail for performance metrics
      })
    }
  }
}

export const errorService = new ErrorService()
export default errorService