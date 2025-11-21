import { apiClient } from './apiClient'

export const dashboardService = {
  getAdminDashboard: () => apiClient.get('/dashboard/admin'),
  getStaffDashboard: () => apiClient.get('/dashboard/staff'),
  getStudentDashboard: () => apiClient.get('/dashboard/student')
}
