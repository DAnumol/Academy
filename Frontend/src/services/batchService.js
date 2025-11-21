import { apiClient } from './apiClient'

export const batchService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    const queryString = params.toString()
    const url = queryString ? `/batches?${queryString}` : '/batches'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.batches || response.batches || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (batchData) => {
    return apiClient.post('/batches', batchData)
  },

  update: async (id, batchData) => {
    return apiClient.put(`/batches/${id}`, batchData)
  },

  delete: async (id) => {
    return apiClient.delete(`/batches/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/batches/${id}`)
  },

  // Legacy methods for backward compatibility
  getBatch: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createBatch: function(data) { return this.create(data) },
  updateBatch: function(id, data) { return this.update(id, data) },
  deleteBatch: function(id) { return this.delete(id) }
}