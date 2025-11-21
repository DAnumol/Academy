import { apiClient } from './apiClient'

export const attendanceService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.date) params.append('date', filters.date)
    if (filters.batchId) params.append('batchId', filters.batchId)
    
    const queryString = params.toString()
    const url = queryString ? `/attendance?${queryString}` : '/attendance'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.attendance || response.attendance || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (attendanceData) => {
    return apiClient.post('/attendance', attendanceData)
  },

  update: async (id, attendanceData) => {
    return apiClient.put(`/attendance/${id}`, attendanceData)
  },

  delete: async (id) => {
    return apiClient.delete(`/attendance/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/attendance/${id}`)
  },

  markAttendance: async (attendanceData) => {
    return apiClient.post('/attendance/mark', attendanceData)
  },

  getStudentAttendance: async (studentId, month, year) => {
    return apiClient.get(`/attendance/student/${studentId}?month=${month}&year=${year}`)
  },

  // Legacy methods for backward compatibility
  getAttendance: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createAttendance: function(data) { return this.create(data) },
  updateAttendance: function(id, data) { return this.update(id, data) },
  deleteAttendance: function(id) { return this.delete(id) }
}