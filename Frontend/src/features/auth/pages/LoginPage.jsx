import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoginForm from '../components/LoginForm'
import FloatingElements from '@components/animations/FloatingElements'
import ParticleBackground from '@components/animations/ParticleBackground'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground className="opacity-30" />
      <FloatingElements className="opacity-20" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-4xl font-bold gradient-text mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Enterprise Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Modern admin experience with advanced animations
          </motion.p>
        </motion.div>
        
        <LoginForm />
      </div>
      
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
        Demo: Use any email/password (min 6 chars)
      </div>
    </div>
  )
}

export default LoginPage