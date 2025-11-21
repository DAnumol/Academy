import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    socialLogin,
    logout,
    updateProfile,
    checkAuth
  } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    socialLogin,
    logout,
    updateProfile
  }
}