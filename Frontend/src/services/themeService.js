import apiClient from './apiClient'

export const themeService = {
  getThemePreference: async () => {
    const response = await apiClient.get('/theme')
    return response.data
  },

  updateThemePreference: async (themeData) => {
    const response = await apiClient.put('/theme', themeData)
    return response.data
  },

  resetThemePreference: async () => {
    const response = await apiClient.post('/theme/reset')
    return response.data
  }
}
