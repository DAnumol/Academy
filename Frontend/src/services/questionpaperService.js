import { apiClient } from './apiClient'

export const questionpaperService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.subjectId) params.append('subjectId', filters.subjectId)
    if (filters.examId) params.append('examId', filters.examId)
    
    const queryString = params.toString()
    const url = queryString ? `/questionpapers?${queryString}` : '/questionpapers'
    
    const response = await apiClient.get(url)
    return {
      data: response.data?.questionPapers || response.questionPapers || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },

  create: async (questionpaperData) => {
    const formData = new FormData()
    
    Object.keys(questionpaperData).forEach(key => {
      if (key === 'file' && questionpaperData[key]) {
        formData.append('questionPaper', questionpaperData[key])
      } else if (key === 'questionSet' && questionpaperData[key]) {
        const questionSet = JSON.parse(JSON.stringify(questionpaperData[key]))
        
        questionpaperData[key].forEach((q, index) => {
          if (q.questionImage && q.questionImage instanceof File) {
            formData.append(`questionImage${index}`, q.questionImage)
            delete questionSet[index].questionImage
          } else if (questionSet[index].questionImage === '') {
            delete questionSet[index].questionImage
          }
        })
        
        formData.append(key, JSON.stringify(questionSet))
      } else if (questionpaperData[key] !== null && questionpaperData[key] !== undefined) {
        formData.append(key, questionpaperData[key])
      }
    })
    
    return apiClient.post('/questionpapers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  update: async (id, questionpaperData) => {
    const formData = new FormData()
    
    Object.keys(questionpaperData).forEach(key => {
      if (key === 'file' && questionpaperData[key]) {
        formData.append('questionPaper', questionpaperData[key])
      } else if (key === 'questionSet' && questionpaperData[key]) {
        const questionSet = JSON.parse(JSON.stringify(questionpaperData[key]))
        
        questionpaperData[key].forEach((q, index) => {
          if (q.questionImage && q.questionImage instanceof File) {
            formData.append(`questionImage${index}`, q.questionImage)
            delete questionSet[index].questionImage
          } else if (questionSet[index].questionImage === '') {
            delete questionSet[index].questionImage
          }
        })
        
        formData.append(key, JSON.stringify(questionSet))
      } else if (questionpaperData[key] !== null && questionpaperData[key] !== undefined) {
        formData.append(key, questionpaperData[key])
      }
    })
    
    return apiClient.put(`/questionpapers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  delete: async (id) => {
    return apiClient.delete(`/questionpapers/${id}`)
  },

  getById: async (id) => {
    return apiClient.get(`/questionpapers/${id}`)
  },

  // Legacy methods for backward compatibility
  getQuestionPapers: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createQuestionPaper: function(data) { return this.create(data) },
  updateQuestionPaper: function(id, data) { return this.update(id, data) },
  deleteQuestionPaper: function(id) { return this.delete(id) }
}