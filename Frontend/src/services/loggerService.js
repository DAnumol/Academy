import { APP_CONFIG } from '@config/app'

class LoggerService {
  constructor() {
    this.logQueue = []
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushLogs()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  log(level, message, data = {}) {
    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    }

    // Always log to console in development
    if (APP_CONFIG.environment === 'development') {
      this.consoleLog(level, message, data)
    }

    // Send to server in production
    if (APP_CONFIG.environment === 'production') {
      if (this.isOnline) {
        this.sendLog(logEntry)
      } else {
        this.queueLog(logEntry)
      }
    }
  }

  consoleLog(level, message, data) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    switch (level) {
      case 'error':
        console.error(prefix, message, data)
        break
      case 'warn':
        console.warn(prefix, message, data)
        break
      case 'info':
        console.info(prefix, message, data)
        break
      case 'debug':
        console.debug(prefix, message, data)
        break
      default:
        console.log(prefix, message, data)
    }
  }

  async sendLog(logEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      })
    } catch (err) {
      this.queueLog(logEntry)
    }
  }

  queueLog(logEntry) {
    this.logQueue.push(logEntry)
    
    // Limit queue size
    if (this.logQueue.length > 100) {
      this.logQueue.shift()
    }
  }

  async flushLogs() {
    if (this.logQueue.length === 0) return

    const logs = [...this.logQueue]
    this.logQueue = []

    try {
      await fetch('/api/logs/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs })
      })
    } catch (err) {
      // Re-queue logs if sending fails
      this.logQueue.unshift(...logs)
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

  // Convenience methods
  error(message, data) {
    this.log('error', message, data)
  }

  warn(message, data) {
    this.log('warn', message, data)
  }

  info(message, data) {
    this.log('info', message, data)
  }

  debug(message, data) {
    this.log('debug', message, data)
  }

  // User action logging
  logUserAction(action, target, data = {}) {
    this.info('User Action', {
      action,
      target,
      ...data
    })
  }

  // API call logging
  logApiCall(method, url, status, duration, data = {}) {
    this.info('API Call', {
      method,
      url,
      status,
      duration,
      ...data
    })
  }

  // Performance logging
  logPerformance(metric, value, data = {}) {
    this.info('Performance', {
      metric,
      value,
      ...data
    })
  }
}

export const logger = new LoggerService()
export default logger