import { useAuthStore } from '@/store/authStore'
import { hasPermission, hasAnyPermission } from '@/config/rolePermissions'

const PermissionGuard = ({ children, permission, anyOf, fallback = null }) => {
  const { user } = useAuthStore()

  if (!user) return fallback

  // Check single permission
  if (permission && !hasPermission(user.role, permission)) {
    return fallback
  }

  // Check any of multiple permissions
  if (anyOf && !hasAnyPermission(user.role, anyOf)) {
    return fallback
  }

  return children
}

export default PermissionGuard
