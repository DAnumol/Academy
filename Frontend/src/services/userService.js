import { apiClient } from './apiClient'

export const userService = {
  getAll: async (filters = {}) => {
    try {
      const token = localStorage.getItem('jwt_token')
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch('http://localhost:5000/api/users', { headers })
      const result = await response.json()
      
      const users = result.users || result.data || result || []
      
      // Apply search filter
      let filtered = users
      if (filters.search) {
        filtered = users.filter(user => 
          user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email?.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      return { data: filtered, total: filtered.length }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { data: [], total: 0 }
    }
  },

  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  create: async (userData) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },

  update: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },

  // Legacy methods for backward compatibility
  getUsers: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createUser: function(data) { return this.create(data) },
  updateUser: function(id, data) { return this.update(id, data) },
  deleteUser: function(id) { return this.delete(id) }
}