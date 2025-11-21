import { memo } from 'react'
import { motion } from 'framer-motion'
import UniqueLoader from '@components/ui/UniqueLoader'

const LoadingSpinner = memo(({ 
  size = 'md', 
  fullScreen = false,
  text = 'Loading...'
}) => {
  const content = <UniqueLoader size={size} text={text} />
  
  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {content}
        </motion.div>
      </motion.div>
    )
  }
  
  return content
})

/**
 * Skeleton Loading Component
 * For content placeholders while loading
 */
export const SkeletonLoader = memo(({ 
  lines = 3, 
  className = '',
  animate = true 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          animate={animate ? {
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={animate ? {
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1
          } : {}}
        />
      ))}
    </div>
  )
})

/**
 * Card Skeleton Component
 * For card-like content placeholders
 */
export const CardSkeleton = memo(({ className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <SkeletonLoader lines={3} />
    </div>
  )
})

export default LoadingSpinner