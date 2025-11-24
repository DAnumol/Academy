// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useForm } from 'react-hook-form'
// import { Mail, Lock, Github, Chrome } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { Button } from '@components/ui/Button'
// import { Input } from '@components/ui/Input'
// import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
// import { useAuth } from '@hooks/useAuth'
// import { useLoading } from '../../../context/LoadingContext'
// import { ROUTES } from '@utils/constants'

// const LoginForm = () => {
//   const [isLoading, setIsLoading] = useState(false)
//   const { login, socialLogin } = useAuth()
//   const { showLoading, hideLoading } = useLoading()
//   const navigate = useNavigate()
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm()

//   const onSubmit = async (data) => {
//     setIsLoading(true)
//     showLoading('Signing you in...')
//     try {
//       await login(data)
//       toast.success('Welcome back!')
//       navigate(ROUTES.DASHBOARD)
//     } catch (error) {
//       toast.error('Invalid credentials')
//     } finally {
//       setIsLoading(false)
//       hideLoading()
//     }
//   }

//   const handleSocialLogin = async (provider) => {
//     toast.error(`${provider} login not implemented yet`)
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold gradient-text">
//             Welcome Back
//           </CardTitle>
//           <p className="text-gray-600 dark:text-gray-400">
//             Sign in to your account
//           </p>
//         </CardHeader>
        
//         <CardContent className="space-y-6">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <Input
//               label="Email"
//               type="email"
//               icon={Mail}
//               placeholder="Enter your email"
//               error={errors.email?.message}
//               {...register('email', {
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^\S+@\S+$/i,
//                   message: 'Invalid email address'
//                 }
//               })}
//             />
            
//             <Input
//               label="Password"
//               type="password"
//               icon={Lock}
//               placeholder="Enter your password"
//               error={errors.password?.message}
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: {
//                   value: 6,
//                   message: 'Password must be at least 6 characters'
//                 }
//               })}
//             />
            
//             <Button
//               type="submit"
//               className="w-full"
//               loading={isLoading}
//               disabled={isLoading}
//             >
//               Sign In
//             </Button>
//           </form>
          
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-gray-300 dark:border-gray-600" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
//                 Or continue with
//               </span>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-3">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleSocialLogin('google')}
//               className="w-full"
//             >
//               <Chrome className="w-4 h-4 mr-2" />
//               Google
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleSocialLogin('github')}
//               className="w-full"
//             >
//               <Github className="w-4 h-4 mr-2" />
//               GitHub
//             </Button>
//           </div>
          
//           <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//             Don't have an account?{' '}
//             <Link
//               to={ROUTES.REGISTER}
//               className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
//             >
//               Sign up
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

// export default LoginForm




import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@hooks/useAuth'
import { useThemeStore } from '@/store/themeStore'
import { useLoading } from '../../../context/LoadingContext'
import { ROUTES } from '@utils/constants'

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const { colors } = useThemeStore()
  const { showLoading, hideLoading } = useLoading()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    showLoading('Signing you in...')
    try {
      await login(data)
      toast.success('Welcome back!')
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
      hideLoading()
    }
  }



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Glassmorphism Card */}
      <div className="relative backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 rounded-3xl opacity-20 blur-xl" style={{ background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})` }} />
        
        <div className="relative">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-3xl sm:text-4xl font-black mb-2"
              style={{ color: colors.error }}
            >
              RED
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.info})` }}>
              NEET Academy
            </h2>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>Your path to medical excellence</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.text, opacity: 0.5 }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl backdrop-blur-sm transition-all focus:outline-none focus:ring-2"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.email.message}</p>}
            </motion.div>

            {/* Password Input */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.text, opacity: 0.5 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-xl backdrop-blur-sm transition-all focus:outline-none focus:ring-2"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' }
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100" style={{ color: colors.text, opacity: 0.5 }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.password.message}</p>}
            </motion.div>

            {/* Submit Button */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm mt-6" style={{ color: colors.text, opacity: 0.7 }}>
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold hover:underline" style={{ color: colors.primary }}>
              Sign up
            </Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

export default LoginForm