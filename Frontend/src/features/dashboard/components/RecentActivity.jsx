import { motion } from 'framer-motion'
import { Clock, User, FileText, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'

const activities = [
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    description: 'John Doe joined the platform',
    time: '2 minutes ago',
    icon: User,
    color: 'text-blue-500'
  },
  {
    id: 2,
    type: 'document',
    title: 'Document uploaded',
    description: 'Annual report.pdf was uploaded',
    time: '15 minutes ago',
    icon: FileText,
    color: 'text-green-500'
  },
  {
    id: 3,
    type: 'settings',
    title: 'Settings updated',
    description: 'Security settings were modified',
    time: '1 hour ago',
    icon: Settings,
    color: 'text-orange-500'
  },
  {
    id: 4,
    type: 'user',
    title: 'User login',
    description: 'Admin user logged in',
    time: '2 hours ago',
    icon: User,
    color: 'text-purple-500'
  }
]

const RecentActivity = ({ className = "" }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
        
        <motion.button
          className="w-full text-center text-sm text-primary-500 hover:text-primary-600 py-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View all activities
        </motion.button>
      </CardContent>
    </Card>
  )
}

export default RecentActivity