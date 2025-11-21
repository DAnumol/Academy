import { motion } from 'framer-motion'

const Loader = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', ring: 'w-6 h-6', center: 'w-2 h-2' },
    md: { container: 'w-12 h-12', ring: 'w-10 h-10', center: 'w-3 h-3' },
    lg: { container: 'w-16 h-16', ring: 'w-14 h-14', center: 'w-4 h-4' },
    xl: { container: 'w-24 h-24', ring: 'w-20 h-20', center: 'w-6 h-6' }
  }

  const dots = Array.from({ length: 3 }, (_, i) => i)
  const currentSize = sizes[size]

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Outer ring */}
        <motion.div
          className={`absolute ${currentSize.ring} border-4 border-primary-200 dark:border-primary-800 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner spinning ring */}
        <motion.div
          className={`absolute ${currentSize.ring} border-4 border-transparent border-t-primary-500 border-r-secondary-500 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center pulse */}
        <motion.div
          className={`${currentSize.center} bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full`}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      
      {text && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </span>
          {dots.map((dot) => (
            <motion.span
              key={dot}
              className="w-1 h-1 bg-primary-500 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Loader