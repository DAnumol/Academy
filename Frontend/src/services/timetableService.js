import { apiClient } from './apiClient'

export const timetableService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.batchId) params.append('batchId', filters.batchId)
    if (filters.day) params.append('day', filters.day)
    
    const queryString = params.toString()
    const url = queryString ? `/timetables?${queryString}` : '/timetables'
    
    return apiClient.get(url)
  },

  create: async (timetableData) => {
    return apiClient.post('/timetables', timetableData)
  },

  update: async (idOrData, dataParam) => {
    let id, timetableData
    
    if (typeof idOrData === 'string' && dataParam) {
      // Called as update(id, data) from useGenericCRUD
      id = idOrData
      timetableData = dataParam
    } else if (typeof idOrData === 'object' && idOrData.id) {
      // Called as update({ id, ...data })
      id = idOrData.id
      const { id: _, ...restData } = idOrData
      timetableData = restData
    } else {
      throw new Error('Invalid update data format')
    }
    
    console.log('Updating timetable with ID:', id, 'Data:', timetableData)
    return apiClient.put(`/timetables/${id}`, timetableData)
  },

  delete: async (id) => {
    return apiClient.delete(`/timetables/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/timetables/${id}`)
  },

  // Legacy methods for backward compatibility
  getTimeTables: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createTimeTable: function(data) { return this.create(data) },
  updateTimeTable: function(id, data) { return this.update({ id, ...data }) },
  deleteTimeTable: function(id) { return this.delete(id) }
}