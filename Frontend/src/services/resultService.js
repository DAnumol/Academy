import { apiClient } from './apiClient'

export const resultService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.examId) params.append('examId', filters.examId)
    if (filters.studentId) params.append('studentId', filters.studentId)
    
    const queryString = params.toString()
    const url = queryString ? `/results?${queryString}` : '/results'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.results || response.results || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (resultData) => {
    return apiClient.post('/results', resultData)
  },

  update: async (id, resultData) => {
    return apiClient.put(`/results/${id}`, resultData)
  },

  delete: async (id) => {
    return apiClient.delete(`/results/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/results/${id}`)
  },

  getMyResults: async () => {
    return apiClient.get('/results/student/my-results')
  },

  // Legacy methods for backward compatibility
  getResults: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createResult: function(data) { return this.create(data) },
  updateResult: function(id, data) { return this.update(id, data) },
  deleteResult: function(id) { return this.delete(id) },
  getStudentResults: function() { return this.getMyResults() }
}