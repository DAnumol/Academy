import { useAuthStore } from '@/store/authStore'
import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions } from '@/config/rolePermissions'

export const usePermissions = () => {
  const { user } = useAuthStore()

  const can = (permission) => {
    return hasPermission(user?.role, permission)
  }

  const canAny = (permissions) => {
    return hasAnyPermission(user?.role, permissions)
  }

  const canAll = (permissions) => {
    return hasAllPermissions(user?.role, permissions)
  }

  const getPermissions = () => {
    return getRolePermissions(user?.role)
  }

  return {
    can,
    canAny,
    canAll,
    getPermissions,
    role: user?.role
  }
}
