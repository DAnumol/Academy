import { useAuthStore } from '@/store/authStore'

const withPermissions = (WrappedComponent, requiredPermissions = []) => {
  const WithPermissionsComponent = (props) => {
    const { user, isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to access this resource.
            </p>
          </div>
        </div>
      )
    }

    const userPermissions = user?.permissions || []
    const hasPermission = requiredPermissions.length === 0 || 
      requiredPermissions.some(permission => userPermissions.includes(permission))

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }

  WithPermissionsComponent.displayName = `withPermissions(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithPermissionsComponent
}

export default withPermissions