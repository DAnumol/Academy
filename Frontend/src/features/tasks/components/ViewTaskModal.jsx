import { motion } from 'framer-motion'
import { FileText, User, Calendar, Flag, Tag, Clock, Edit } from 'lucide-react'
import FullScreenModal from '@components/ui/FullScreenModal'
import { Button } from '@components/ui/Button'

const ViewTaskModal = ({ isOpen, onClose, task, onEdit }) => {
  if (!task) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Todo':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'Medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Task Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
              </div>
            </div>
            <Button onClick={() => onEdit?.(task)} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Task
            </Button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {task.description}
          </p>
        </motion.div>

        {/* Task Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Assignment Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Assignment Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium">{task.assignee}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary-500" />
              Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{task.createdAt}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{task.dueDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Days Remaining:</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tags Section */}
        {task.tags && task.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent-500" />
              Tags
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Progress Overview
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completion:</span>
              <span className="font-medium">
                {task.status === 'Completed' ? '100%' : task.status === 'In Progress' ? '60%' : '0%'}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: task.status === 'Completed' ? '100%' : task.status === 'In Progress' ? '60%' : '0%'
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit?.(task)}>
            Edit Task
          </Button>
        </motion.div>
      </div>
    </FullScreenModal>
  )
}

export default ViewTaskModal