import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail,
  Camera,
  Loader2, AlertCircle
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'

// Loading component
const LoadingCard = ({ className = "" }) => (
  <Card className={`p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  </Card>
)

// Error component
const ErrorCard = ({ error, retry, className = "" }) => (
  <Card className={`p-6 ${className}`}>
    <div className="text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-600 dark:text-red-400 mb-2">Failed to load data</p>
      <Button onClick={retry} size="sm" variant="outline">
        Try Again
      </Button>
    </div>
  </Card>
)

const ProfilePage = () => {
  const { user } = useAuth()
  const userId = user?.userId || user?.id

  // TanStack Query hooks
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    error: profileError, 
    refetch: refetchProfile 
  } = useProfile(userId)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
        
        {/* Profile Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="relative">
              {profileLoading ? (
                <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || user?.name || 'User')}&background=0ea5e9&color=fff`}
                  alt={profileData?.name || user?.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
              )}
              <button className="absolute -bottom-2 -right-2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-white pb-4">
              {profileLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-white/20 rounded w-64 animate-pulse" />
                  <div className="h-6 bg-white/20 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded w-56 animate-pulse" />
                </div>
              ) : profileError ? (
                <div>
                  <h1 className="text-3xl font-bold mb-2">Profile Error</h1>
                  <p className="text-xl text-white/90 mb-1">Failed to load profile</p>
                  <Button onClick={refetchProfile} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">{profileData?.name || user?.name}</h1>
                  <p className="text-xl text-white/90 mb-1">{profileData?.role || user?.role}</p>
                  <p className="text-white/80">User ID: {profileData?.userId || user?.userId}</p>
                </>
              )}
            </div>
            

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
            {profileLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : profileError ? (
              <ErrorCard error={profileError} retry={refetchProfile} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-white">{profileData?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-white">{profileData?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-white">Role: {profileData?.role || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-white">User ID: {profileData?.userId || 'N/A'}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Additional Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
            {profileLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {profileData?.studentProfile && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Student Profile</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {profileData.studentProfile.rollNo || 'N/A'}</p>
                  </div>
                )}
                {profileData?.staffProfile && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Staff Profile</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Qualification: {profileData.staffProfile.qualification || 'N/A'}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Member Since</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage