import { forwardRef, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/cn'

const Card = memo(forwardRef(({ className, children, hover = true, ...props }, ref) => {
  const computedClassName = useMemo(() => cn(
    "border bg-card text-card-foreground backdrop-blur-sm",
    "bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50",
    hover && "card-hover",
    className
  ), [className, hover])

  const cardStyle = useMemo(() => ({
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-base)',
    boxShadow: 'var(--shadow-base)'
  }), [])

  const hoverProps = useMemo(() => 
    hover ? { y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}
  , [hover])

  return (
    <motion.div
      ref={ref}
      className={computedClassName}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}))
Card.displayName = "Card"

const CardHeader = memo(forwardRef(({ className, ...props }, ref) => {
  const computedClassName = useMemo(() => cn("flex flex-col space-y-1.5 p-6", className), [className])
  return (
    <div
      ref={ref}
      className={computedClassName}
      {...props}
    />
  )
}))
CardHeader.displayName = "CardHeader"

const CardTitle = memo(forwardRef(({ className, ...props }, ref) => {
  const computedClassName = useMemo(() => cn("text-2xl font-semibold leading-none tracking-tight", className), [className])
  return (
    <h3
      ref={ref}
      className={computedClassName}
      {...props}
    />
  )
}))
CardTitle.displayName = "CardTitle"

const CardDescription = memo(forwardRef(({ className, ...props }, ref) => {
  const computedClassName = useMemo(() => cn("text-sm text-muted-foreground", className), [className])
  return (
    <p
      ref={ref}
      className={computedClassName}
      {...props}
    />
  )
}))
CardDescription.displayName = "CardDescription"

const CardContent = memo(forwardRef(({ className, ...props }, ref) => {
  const computedClassName = useMemo(() => cn("pt-0", className), [className])
  const contentStyle = useMemo(() => ({ padding: 'var(--spacing-base)' }), [])
  return (
    <div ref={ref} className={computedClassName} style={contentStyle} {...props} />
  )
}))
CardContent.displayName = "CardContent"

const CardFooter = memo(forwardRef(({ className, ...props }, ref) => {
  const computedClassName = useMemo(() => cn("flex items-center p-6 pt-0", className), [className])
  return (
    <div
      ref={ref}
      className={computedClassName}
      {...props}
    />
  )
}))
CardFooter.displayName = "CardFooter"

const GlassCard = memo(forwardRef(({ className, children, ...props }, ref) => {
  const computedClassName = useMemo(() => cn(
    "glass-effect rounded-2xl p-6 shadow-xl",
    className
  ), [className])

  return (
    <motion.div
      ref={ref}
      className={computedClassName}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}))
GlassCard.displayName = "GlassCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, GlassCard }