import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@components/ui/Card'
import { cn } from '@utils/cn'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  className = ""
}) => {
  const isPositive = changeType === 'positive'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <motion.p
                className="text-3xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {value}
              </motion.p>
              {change && (
                <motion.div
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {change}
                </motion.div>
              )}
            </div>
            
            {Icon && (
              <motion.div
                className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            )}
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-xl" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatsCard