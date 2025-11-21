

// Authentication middleware for route protection
export const authMiddleware = {
  // Validate authentication token
  validateToken: (token) => {
    if (!token) return false
    
    try {
      // For demo purposes - in production, verify JWT signature
      if (token.startsWith('demo-jwt-') || token.startsWith('mock-jwt-token-')) {
        const parts = token.split('-')
        const timestamp = parseInt(parts[2])
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours
        
        return Date.now() - timestamp < maxAge
      }
      return false
    } catch (error) {
      return false
    }
  },

  // Check if user has required permissions
  hasPermission: (userRole, requiredRole) => {
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'user': 1,
      'guest': 0
    }
    
    const userLevel = roleHierarchy[userRole] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  },





  // Check for suspicious activity
  detectSuspiciousActivity: (request) => {
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /window\.location/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /expression\s*\(/gi
    ]

    try {
      const requestString = typeof request === 'string' ? request : JSON.stringify(request)
      return suspiciousPatterns.some(pattern => pattern.test(requestString))
    } catch (error) {
      return true // Treat serialization errors as suspicious
    }
  },

  // Rate limiting check
  checkRateLimit: (identifier, maxRequests = 100, windowMs = 60000) => {
    const now = Date.now()
    const key = `rate_limit_${identifier}`
    
    let requests = JSON.parse(sessionStorage.getItem(key) || '[]')
    requests = requests.filter(time => now - time < windowMs)
    
    if (requests.length >= maxRequests) {
      return false
    }
    
    requests.push(now)
    sessionStorage.setItem(key, JSON.stringify(requests))
    return true
  }
}

// Higher-order component for route protection
export const withAuthProtection = (WrappedComponent, requiredRole = 'user') => {
  return function ProtectedComponent(props) {
    const token = localStorage.getItem('auth_token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Check authentication
    if (!authMiddleware.validateToken(token)) {
      window.location.href = '/login'
      return null
    }
    
    // Check permissions
    if (!authMiddleware.hasPermission(user.role, requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
    
    return <WrappedComponent {...props} />
  }
}