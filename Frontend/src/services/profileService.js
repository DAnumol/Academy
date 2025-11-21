import { apiClient } from './apiClient'

export const profileService = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data || response
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    const response = await apiClient.put(`/users/${userId}`, profileData)
    return response.data || response
  }
}