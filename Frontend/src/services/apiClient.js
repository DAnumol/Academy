import axios from 'axios'
import toast from 'react-hot-toast'
import { APP_CONFIG } from '@config/app'

import { logger } from './loggerService'

/**
 * API Client Configuration
 * Centralized HTTP client with interceptors for auth and error handling
 */

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': APP_CONFIG.version
  },
})

/**
 * Request Interceptor
 * Automatically adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const startTime = performance.now()
    
    // Get JWT token
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    

    
    // Add request metadata
    config.metadata = { startTime }
    
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: Object.keys(config.headers)
    })
    
    return config
  },
  (error) => {
    logger.error('API Request Error', error)
    return Promise.reject(error)
  }
)



/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response time and details
    if (response.config.metadata) {
      const duration = performance.now() - response.config.metadata.startTime
      
      logger.logApiCall(
        response.config.method?.toUpperCase(),
        response.config.url,
        response.status,
        Math.round(duration)
      )
      
      // Performance monitoring
      if (duration > 2000) {
        logger.warn('Slow API Response', {
          url: response.config.url,
          duration: Math.round(duration)
        })
      }
    }
    
    return response.data
  },
  (error) => {
    const skipErrorToast = error.config?.skipErrorToast
    
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response
      
      if (!skipErrorToast) {
        switch (status) {
          case 401:
            // Unauthorized - clear auth and redirect to login
            localStorage.removeItem('jwt_token')
            localStorage.removeItem('user_data')
            window.location.href = '/login'
            break
            
          case 403:
            // Forbidden
            toast.error('You do not have permission to perform this action.')
            break
            
          case 400:
            // Bad request
            toast.error(data?.message || 'Invalid request.')
            break
            
          case 404:
            // Not found
            toast.error(data?.message || 'The requested resource was not found.')
            break
            
          case 422:
            // Validation error
            if (data?.errors) {
              Object.values(data.errors).forEach(error => {
                toast.error(error)
              })
            } else {
              toast.error(data?.message || 'Validation error occurred.')
            }
            break
            
          case 429:
            // Rate limit
            toast.error('Too many requests. Please try again later.')
            break
            
          case 500:
            // Server error
            toast.error('Server error occurred. Please try again later.')
            break
            
          default:
            toast.error(data?.message || 'An unexpected error occurred.')
        }
      } else if (status === 401) {
        // Always handle 401 even with skipErrorToast
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_data')
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(data?.message || `HTTP ${status} Error`))
    } else if (error.request) {
      // Network error
      if (!skipErrorToast) {
        toast.error('Network error. Please check your connection.')
      }
      return Promise.reject(new Error('Network error'))
    } else {
      // Other error
      if (!skipErrorToast) {
        toast.error('An unexpected error occurred.')
      }
      return Promise.reject(error)
    }
  }
)

/**
 * API Helper Functions
 * Convenient methods for common HTTP operations
 */
export const api = {
  // GET request
  get: (url, config = {}) => apiClient.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Upload file
  upload: (url, file, onProgress = null) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      },
    })
  },
  
  // Download file
  download: async (url, filename) => {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    
    const blob = new Blob([response])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  }
}

export default apiClient