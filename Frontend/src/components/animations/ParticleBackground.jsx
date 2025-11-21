import { motion } from 'framer-motion'

const ParticleBackground = ({ className = "" }) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary-400 rounded-full opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [-20, 20],
            opacity: [0.1, 0.5, 0.1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground