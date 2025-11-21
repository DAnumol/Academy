import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profileService'
import toast from 'react-hot-toast'

// Query keys for better cache management
export const profileKeys = {
  all: ['profile'],
  profile: (userId) => [...profileKeys.all, 'profile', userId],
}

// Custom hook for profile data
export const useProfile = (userId) => {
  return useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => profileService.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })
}

// Custom hook for updating profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, profileData }) => 
      profileService.updateProfile(userId, profileData),
    onSuccess: (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(
        profileKeys.profile(variables.userId), 
        data
      )
      
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: profileKeys.all
      })
      
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error('Failed to update profile. Please try again.')
      console.error('Profile update error:', error)
    },
  })
}

// Prefetch profile data
export const usePrefetchProfile = () => {
  const queryClient = useQueryClient()

  const prefetchProfile = (userId) => {
    queryClient.prefetchQuery({
      queryKey: profileKeys.profile(userId),
      queryFn: () => profileService.getProfile(userId),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchProfile }
}