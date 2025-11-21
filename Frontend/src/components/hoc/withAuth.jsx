import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@utils/constants'

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
      checkAuth()
    }, [])

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate(ROUTES.LOGIN, { replace: true })
      }
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return AuthenticatedComponent
}

export default withAuth