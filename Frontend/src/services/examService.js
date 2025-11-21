// import { apiClient } from './apiClient'

// export const examService = {
//   getAll: async (filters = {}) => {
//     const params = new URLSearchParams()
//     if (filters.search) params.append('search', filters.search)
//     if (filters.page) params.append('page', filters.page)
//     if (filters.limit) params.append('limit', filters.limit)
//     if (filters.batchId) params.append('batchId', filters.batchId)
//     if (filters.subjectId) params.append('subjectId', filters.subjectId)
    
//     const queryString = params.toString()
//     const url = queryString ? `/exams?${queryString}` : '/exams'
    
//     const response = await apiClient.get(url)
//     return {
//       data: response.data?.exams || response.exams || response.data || response,
//       total: response.data?.totalCount || response.totalCount || 0
//     }
//   },

//   create: async (examData) => {
//     return apiClient.post('/exams', examData)
//   },

//   update: async (id, examData) => {
//     return apiClient.put(`/exams/${id}`, examData)
//   },

//   delete: async (id) => {
//     return apiClient.delete(`/exams/${id}`)
//   },

//   getById: async (id) => {
//     return apiClient.get(`/exams/${id}`)
//   },

//   // Legacy methods for backward compatibility
//   getExams: function(filters) { return this.getAll(filters).then(result => result.data || result) },
//   createExam: function(data) { return this.create(data) },
//   updateExam: function(id, data) { return this.update(id, data) },
//   deleteExam: function(id) { return this.delete(id) }
// }


import { apiClient } from './apiClient'
 
export const examService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.batchId) params.append('batchId', filters.batchId)
    if (filters.subjectId) params.append('subjectId', filters.subjectId)
   
    const queryString = params.toString()
    const url = queryString ? `/exams?${queryString}` : '/exams'
   
    const response = await apiClient.get(url)
    return {
      data: response.data?.exams || response.exams || response.data || response,
      total: response.data?.totalCount || response.totalCount || 0
    }
  },
 
  create: async (examData) => {
    return apiClient.post('/exams', examData)
  },
 
  update: async (id, examData) => {
    return apiClient.put(`/exams/${id}`, examData)
  },
 
  delete: async (id) => {
    return apiClient.delete(`/exams/${id}`)
  },
 
  getById: async (id) => {
    return apiClient.get(`/exams/${id}`)
  },
 
  toggleStatus: async (id) => {
    return apiClient.patch(`/exams/${id}/toggle-status`)
  },

  getStudentExams: async () => {
    return apiClient.get('/exams/student/my-exams')
  },

  submitExam: async (examId, answers, violations) => {
    return apiClient.post('/exams/student/submit', { examId, answers, violations })
  },
 
  // Legacy methods for backward compatibility
  getExams: function(filters) { return this.getAll(filters).then(result => result.data || result) },
  createExam: function(data) { return this.create(data) },
  updateExam: function(id, data) { return this.update(id, data) },
  deleteExam: function(id) { return this.delete(id) },
  toggleExamStatus: function(id) { return this.toggleStatus(id) },
  getMyExams: function() { return this.getStudentExams() },
  submit: function(examId, answers, violations) { return this.submitExam(examId, answers, violations) }
}
 