import { apiClient } from './apiClient'

export const notificationService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.type) params.append('type', filters.type)
    if (filters.isRead !== undefined) params.append('isRead', filters.isRead)
    
    const queryString = params.toString()
    const url = queryString ? `/notifications?${queryString}` : '/notifications'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.notifications || response.notifications || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  markAsRead: async (id) => {
    return apiClient.put(`/notifications/${id}/read`)
  },

  markAllAsRead: async () => {
    return apiClient.put('/notifications/mark-all-read')
  },

  delete: async (id) => {
    return apiClient.delete(`/notifications/${id}`)
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data?.count || response.count || 0
  }
}