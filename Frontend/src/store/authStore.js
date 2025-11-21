import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      const response = await authService.login(credentials)
      
      // Handle nested response format from backend
      const { user, token } = response.data || response
      
      localStorage.setItem('jwt_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
      
      return { success: true, user }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      const response = await authService.register(userData)
      
      // Handle nested response format from backend
      const { user, token } = response.data || response
      
      localStorage.setItem('jwt_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
      
      return { success: true, user }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  logout: () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_data')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    })
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('jwt_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        set({ user, token, isAuthenticated: true, isLoading: false })
        return true
      } catch (error) {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_data')
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
    return false
  }
}))