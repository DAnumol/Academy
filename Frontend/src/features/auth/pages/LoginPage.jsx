// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import LoginForm from '../components/LoginForm'
// import FloatingElements from '@components/animations/FloatingElements'
// import ParticleBackground from '@components/animations/ParticleBackground'
// import { useAuth } from '@hooks/useAuth'
// import { ROUTES } from '@utils/constants'

// const LoginPage = () => {
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(ROUTES.DASHBOARD, { replace: true })
//     }
//   }, [isAuthenticated, navigate])

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <ParticleBackground className="opacity-30" />
//       <FloatingElements className="opacity-20" />
      
//       <div className="relative z-10 w-full max-w-md px-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, type: "spring" }}
//           className="text-center mb-8"
//         >
//           <motion.h1
//             className="text-4xl font-bold gradient-text mb-2"
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             Enterprise Dashboard
//           </motion.h1>
//           <motion.p
//             className="text-gray-600 dark:text-gray-400"
//             initial={{ y: -10, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//           >
//             Modern admin experience with advanced animations
//           </motion.p>
//         </motion.div>
        
//         <LoginForm />
//       </div>
      
//       <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
//         Demo: Use any email/password (min 6 chars)
//       </div>
//     </div>
//   )
// }

// export default LoginPage


import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoginForm from '../components/LoginForm'
import { useAuth } from '@hooks/useAuth'
import { useThemeStore } from '@/store/themeStore'
import { ROUTES } from '@utils/constants'
import { Sparkles, Zap, Shield } from 'lucide-react'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const { colors } = useThemeStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8" style={{ background: colors.background }}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: colors.primary, opacity: 0.2 }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: colors.secondary, opacity: 0.2 }}
        />
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl"
          style={{ background: colors.info, opacity: 0.15 }}
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 opacity-20"
      >
        <Sparkles className="w-12 h-12" style={{ color: colors.primary }} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-32 opacity-20"
      >
        <Zap className="w-16 h-16" style={{ color: colors.secondary }} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-20 opacity-20"
      >
        <Shield className="w-10 h-10" style={{ color: colors.success }} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="hidden lg:block"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block text-6xl lg:text-7xl font-black mb-4"
                style={{ color: colors.error }}
              >
                RED
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-bold" style={{ color: colors.text }}>
                <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.info})` }}>
                  NEET Academy
                </span>
              </h1>
            </div>
            <p className="text-lg lg:text-xl mb-8" style={{ color: colors.text, opacity: 0.7 }}>
              Master NEET with India's most innovative learning platform
            </p>
            <div className="space-y-4">
              {[{ icon: Sparkles, text: 'Expert Faculty' }, { icon: Zap, text: 'Live Classes' }, { icon: Shield, text: 'Guaranteed Results' }].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm"
                  style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
                >
                  <div className="p-2 rounded-lg" style={{ background: colors.primary, opacity: 0.1 }}>
                    <item.icon className="w-6 h-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage