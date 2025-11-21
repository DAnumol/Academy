import { motion } from 'framer-motion'

const FloatingElements = ({ className = "" }) => {
  const shapes = [
    { id: 1, color: 'bg-primary-500', size: 'w-16 h-16', delay: 0 },
    { id: 2, color: 'bg-secondary-500', size: 'w-12 h-12', delay: 0.5 },
    { id: 3, color: 'bg-accent-500', size: 'w-20 h-20', delay: 1 },
    { id: 4, color: 'bg-green-500', size: 'w-14 h-14', delay: 1.5 },
    { id: 5, color: 'bg-yellow-500', size: 'w-10 h-10', delay: 2 }
  ]

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.color} ${shape.size} rounded-full opacity-20 blur-sm`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 10 + shape.id,
            repeat: Infinity,
            delay: shape.delay,
            ease: "linear"
          }}
          style={{
            left: `${20 + shape.id * 15}%`,
            top: `${10 + shape.id * 10}%`
          }}
        />
      ))}
    </div>
  )
}

export default FloatingElements