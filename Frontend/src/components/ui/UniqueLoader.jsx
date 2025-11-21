import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12'
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

const UniqueLoader = memo(({ size = 'md', text = 'Loading...' }) => {
  const spinnerClassName = useMemo(() => 
    `${sizeClasses[size]} border-4 border-primary-200 dark:border-primary-800 rounded-full`,
    [size]
  )

  const overlayClassName = useMemo(() => 
    `absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent border-t-primary-500 rounded-full`,
    [size]
  )

  const textClassName = useMemo(() => 
    `${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium`,
    [size]
  )

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <motion.div
          className={spinnerClassName}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={overlayClassName}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {text && (
        <motion.p
          className={textClassName}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
})

UniqueLoader.displayName = 'UniqueLoader'

export default UniqueLoader