import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { hasPermission } from '@/config/rolePermissions'
import { routePermissions } from '@/config/routePermissions'

const ProtectedRoute = ({ children, path, requiredPermission }) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredPermission) {
    if (!hasPermission(user?.role, requiredPermission)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  if (path && routePermissions[path]) {
    const permission = typeof routePermissions[path] === 'object' 
      ? routePermissions[path][user?.role]
      : routePermissions[path]
    
    if (permission && !hasPermission(user?.role, permission)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

export default ProtectedRoute
