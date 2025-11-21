import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Github, Chrome } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { useAuth } from '@hooks/useAuth'
import { useLoading } from '../../../context/LoadingContext'
import { ROUTES } from '@utils/constants'

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { login, socialLogin } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

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

  const handleSocialLogin = async (provider) => {
    toast.error(`${provider} login not implemented yet`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold gradient-text">
            Welcome Back
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('google')}
              className="w-full"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('github')}
              className="w-full"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LoginForm