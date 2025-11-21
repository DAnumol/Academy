import { apiClient } from './apiClient'

export const classService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.batchId) params.append('batchId', filters.batchId)
    
    const queryString = params.toString()
    const url = queryString ? `/classes?${queryString}` : '/classes'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.classes || response.classes || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (classData) => {
    return apiClient.post('/classes', classData)
  },

  update: async (id, classData) => {
    return apiClient.put(`/classes/${id}`, classData)
  },

  delete: async (id) => {
    return apiClient.delete(`/classes/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/classes/${id}`)
  },

  // Legacy methods for backward compatibility
  getClasses: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createClass: function(data) { return this.create(data) },
  updateClass: function(id, data) { return this.update(id, data) },
  deleteClass: function(id) { return this.delete(id) }
}