import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import RegisterForm from '../components/RegisterForm'
import FloatingElements from '@components/animations/FloatingElements'
import ParticleBackground from '@components/animations/ParticleBackground'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'

const RegisterPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-secondary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            Join Enterprise
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create your account and unlock powerful features
          </motion.p>
        </motion.div>
        
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage