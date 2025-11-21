import { apiClient } from './apiClient'

export const courseService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    const queryString = params.toString()
    const url = queryString ? `/courses?${queryString}` : '/courses'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.courses || response.courses || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (courseData) => {
    return apiClient.post('/courses', courseData)
  },

  update: async (id, courseData) => {
    return apiClient.put(`/courses/${id}`, courseData)
  },

  delete: async (id) => {
    return apiClient.delete(`/courses/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/courses/${id}`)
  },

  // Legacy methods for backward compatibility
  getCourses: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createCourse: function(data) { return this.create(data) },
  updateCourse: function(id, data) { return this.update(id, data) },
  deleteCourse: function(id) { return this.delete(id) }
}