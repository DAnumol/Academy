import { forwardRef, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/cn'

const buttonVariants = {
  default: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
  destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
  link: "text-primary-500 underline-offset-4 hover:underline"
}

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
}

const Button = memo(forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  disabled = false,
  loading = false,
  children,
  ...props 
}, ref) => {
  const Component = motion.button

  const computedClassName = useMemo(() => cn(
    "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    sizeVariants[size],
    className
  ), [variant, size, className])

  const buttonStyle = useMemo(() => ({
    borderRadius: 'var(--border-radius)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-base)'
  }), [])

  const motionProps = useMemo(() => ({
    whileHover: { scale: disabled || loading ? 1 : 1.02 },
    whileTap: { scale: disabled || loading ? 1 : 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }), [disabled, loading])

  return (
    <Component
      className={computedClassName}
      style={buttonStyle}
      ref={ref}
      disabled={disabled || loading}
      {...motionProps}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  )
}))

Button.displayName = "Button"

// Memoized variants for performance
const MemoizedButton = memo(Button)

export { Button, buttonVariants }