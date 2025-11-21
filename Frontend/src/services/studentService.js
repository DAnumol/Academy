import { apiClient } from './apiClient'

export const studentService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    const queryString = params.toString()
    const url = queryString ? `/students?${queryString}` : '/students'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.students || response.students || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (studentData) => {
    return apiClient.post('/students', studentData)
  },

  update: async (id, studentData) => {
    return apiClient.put(`/students/${id}`, studentData)
  },

  delete: async (id) => {
    return apiClient.delete(`/students/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/students/${id}`)
  },

  // Legacy methods for backward compatibility
  getStudents: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createStudent: function(data) { return this.create(data) },
  updateStudent: function(id, data) { return this.update(id, data) },
  deleteStudent: function(id) { return this.delete(id) }
}