import { apiClient } from './apiClient'

export const studymaterialService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.subjectId) params.append('subjectId', filters.subjectId)
    if (filters.type) params.append('type', filters.type)
    
    const queryString = params.toString()
    const url = queryString ? `/materials?${queryString}` : '/materials'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.items || response.items || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (studymaterialData) => {
    console.log('Service received data:', studymaterialData)
    console.log('File object:', studymaterialData.file)
    
    const formData = new FormData()
    
    // Add regular fields
    Object.keys(studymaterialData).forEach(key => {
      if (key !== 'file' && studymaterialData[key] !== undefined && studymaterialData[key] !== null) {
        console.log(`Adding field ${key}:`, studymaterialData[key])
        formData.append(key, studymaterialData[key])
      }
    })
    
    // Add file if present
    if (studymaterialData.file) {
      console.log('Adding file to FormData:', studymaterialData.file)
      formData.append('material', studymaterialData.file)
    } else {
      console.log('No file found in studymaterialData')
    }
    
    return apiClient.post('/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  update: async (id, studymaterialData) => {
    console.log('Update service received data:', studymaterialData)
    
    const formData = new FormData()
    
    // Add regular fields
    Object.keys(studymaterialData).forEach(key => {
      if (key !== 'file' && studymaterialData[key] !== undefined && studymaterialData[key] !== null) {
        formData.append(key, studymaterialData[key])
      }
    })
    
    // Add file if present
    if (studymaterialData.file) {
      console.log('Adding file to update FormData:', studymaterialData.file)
      formData.append('material', studymaterialData.file)
    }
    
    return apiClient.put(`/materials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  delete: async (id) => {
    return apiClient.delete(`/materials/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/materials/${id}`)
  },

  // Legacy methods for backward compatibility
  getStudyMaterials: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createStudyMaterial: function(data) { return this.create(data) },
  updateStudyMaterial: function(id, data) { return this.update(id, data) },
  deleteStudyMaterial: function(id) { return this.delete(id) }
}