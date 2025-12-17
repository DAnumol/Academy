import apiClient from './apiClient'

export const commonAttendanceService = {
  getAll: () => apiClient.get('/commonattendance'),
  getById: (id) => apiClient.get(`/commonattendance/${id}`),
  create: (data) => apiClient.post('/commonattendance', data),
  update: ({ id, ...data }) => apiClient.put(`/commonattendance/${id}`, data),
  delete: (id) => apiClient.delete(`/commonattendance/${id}`)
}
