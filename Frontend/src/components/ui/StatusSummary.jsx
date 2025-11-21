import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react'

const StatusSummary = ({ data, className = '' }) => {
  const statusConfig = {
    'Completed': {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800'
    },
    'In Progress': {
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800'
    },
    'Todo': {
      icon: Circle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800'
    }
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {Object.entries(data).map(([status, count], index) => {
        const config = statusConfig[status]
        if (!config) return null
        
        const Icon = config.icon
        
        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${config.bg} ${config.border} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {status}
                </p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {count}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StatusSummary