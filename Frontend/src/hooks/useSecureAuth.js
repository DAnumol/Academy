import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

// Enhanced authentication hook with security features
export const useSecureAuth = () => {
  const auth = useAuth()
  const [sessionTimeout, setSessionTimeout] = useState(null)
  const [isSessionValid, setIsSessionValid] = useState(true)

  // Session timeout management
  useEffect(() => {
    if (auth.isAuthenticated) {
      const timeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000 // 30 minutes
      
      const timeoutId = setTimeout(() => {
        setIsSessionValid(false)
        auth.logout()
      }, timeout)

      setSessionTimeout(timeoutId)

      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
  }, [auth.isAuthenticated])

  // Activity tracking to extend session
  useEffect(() => {
    const resetTimeout = () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
        const timeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000
        
        const newTimeoutId = setTimeout(() => {
          setIsSessionValid(false)
          auth.logout()
        }, timeout)
        
        setSessionTimeout(newTimeoutId)
      }
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true)
      })
    }
  }, [sessionTimeout, auth])

  // Enhanced login with security checks
  const secureLogin = async (credentials) => {
    try {
      // Add security headers
      const secureCredentials = {
        ...credentials,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      const result = await auth.login(secureCredentials)
      setIsSessionValid(true)
      return result
    } catch (error) {
      setIsSessionValid(false)
      throw error
    }
  }

  // Enhanced logout with cleanup
  const secureLogout = async () => {
    try {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
        setSessionTimeout(null)
      }
      
      // Clear sensitive data
      localStorage.removeItem('auth_token')
      
      await auth.logout()
      setIsSessionValid(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    ...auth,
    login: secureLogin,
    logout: secureLogout,
    isSessionValid
  }
}