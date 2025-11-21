import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/services/authService'
import { showToast } from '@/utils/toast'

const AdminRegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    secretKey: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.registerAdmin(formData)
      showToast.success('Admin account created successfully')
      navigate('/login')
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Admin Registration
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Restricted Access - Secret Key Required
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">
              Admin Secret Key *
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                required
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                className="w-full px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter admin secret key"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminRegisterPage
