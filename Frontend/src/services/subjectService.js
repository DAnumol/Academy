import { apiClient } from './apiClient'

export const subjectService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.courseId) params.append('courseId', filters.courseId)
    
    const queryString = params.toString()
    const url = queryString ? `/subjects?${queryString}` : '/subjects'
    
    return apiClient.get(url)
  },

  create: async (subjectData) => {
    return apiClient.post('/subjects', subjectData)
  },

  update: async (id, subjectData) => {
    return apiClient.put(`/subjects/${id}`, subjectData)
  },

  delete: async (id) => {
    return apiClient.delete(`/subjects/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/subjects/${id}`)
  },

  // Legacy methods for backward compatibility
  getSubjects: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createSubject: function(data) { return this.create(data) },
  updateSubject: function(id, data) { return this.update(id, data) },
  deleteSubject: function(id) { return this.delete(id) }
}