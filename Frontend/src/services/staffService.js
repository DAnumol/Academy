import { apiClient } from './apiClient'

export const staffService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.dropdown) params.append('dropdown', 'true')
    
    const queryString = params.toString()
    const url = queryString ? `/staff?${queryString}` : '/staff'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.staff || response.staff || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  getForDropdown: async () => {
    return staffService.getAll({ dropdown: true, limit: 1000 })
  },

  create: async (staffData) => {
    return apiClient.post('/staff', staffData)
  },

  update: async (id, staffData) => {
    return apiClient.put(`/staff/${id}`, staffData)
  },

  delete: async (id) => {
    return apiClient.delete(`/staff/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/staff/${id}`)
  },

  // Legacy methods for backward compatibility
  getStaffs: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createStaff: function(data) { return this.create(data) },
  updateStaff: function(id, data) { return this.update(id, data) },
  deleteStaff: function(id) { return this.delete(id) }
}