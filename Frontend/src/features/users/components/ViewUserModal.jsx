import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, Edit } from 'lucide-react'
import FullScreenModal from '@components/ui/FullScreenModal'
import { Button } from '@components/ui/Button'

const ViewUserModal = ({ isOpen, onClose, user, onEdit }) => {
  if (!user) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-6 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {user.email}
                </p>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.name}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.role}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Login
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.lastLogin}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[120px]"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => onEdit(user)}
              className="min-w-[120px] flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </Button>
          </motion.div>
        </div>
      </div>
    </FullScreenModal>
  )
}

export default ViewUserModal