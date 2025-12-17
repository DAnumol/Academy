import api from './apiClient';

export const feePaymentService = {
  create: (data) => api.post('/fee-payments', data),
  getAll: (params) => api.get('/fee-payments', { params }),
  getOverview: (params) => api.get('/fee-payments/overview', { params }),
  getStudentSummary: (studentId) => api.get(`/fee-payments/student/${studentId}`),
  delete: (id) => api.delete(`/fee-payments/${id}`)
};
