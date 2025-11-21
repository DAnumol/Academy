import { apiClient } from './apiClient'


/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
const authServiceImpl = {

  /**
   * Login user with credentials
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} User data and token
   */
  async register(userData) {
    return apiClient.post('/auth/register', userData)
  },

  /**
   * Get current user data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(token) {
    return apiClient.get('/auth/profile')
  },

  /**
   * Refresh JWT token
   * @param {string} token - Current JWT token
   * @returns {Promise<Object>} New token
   */
  async refreshToken(token) {
    return apiClient.post('/auth/refresh', { token })
  },

  /**
   * Logout user (if server-side logout is needed)
   * @param {string} token - JWT token
   * @returns {Promise<void>}
   */
  async logout(token) {
    return apiClient.post('/auth/logout')
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    return apiClient.post('/auth/password-reset', { email })
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset password data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @returns {Promise<void>}
   */
  async resetPassword(data) {
    return apiClient.post('/auth/reset-password', data)
  },

  /**
   * Register admin with secret key
   * @param {Object} data - Admin registration data
   * @param {string} data.username - Admin username
   * @param {string} data.email - Admin email
   * @param {string} data.password - Admin password
   * @param {string} data.secretKey - Admin secret key
   * @returns {Promise<Object>} Admin data and token
   */
  async registerAdmin(data) {
    return apiClient.post('/auth/admin/register', data)
  }
}

export const authService = authServiceImpl