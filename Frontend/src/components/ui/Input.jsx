import { forwardRef, useState, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@utils/cn'

const Input = memo(forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  icon: Icon,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  
  const isPassword = useMemo(() => type === 'password', [type])
  const inputType = useMemo(() => isPassword && showPassword ? 'text' : type, [isPassword, showPassword, type])
  
  const togglePassword = useCallback(() => setShowPassword(prev => !prev), [])
  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        )}
        
        <motion.input
          type={inputType}
          className={useMemo(() => cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800",
            Icon && "pl-10",
            isPassword && "pr-10",
            error 
              ? "border-red-500 focus-visible:ring-red-500" 
              : "border-gray-300 dark:border-gray-600 focus-visible:ring-primary-500",
            focused && "shadow-lg",
            props.disabled && props.value ? "!text-gray-900 dark:!text-white !opacity-100" : "disabled:opacity-50",
            className
          ), [Icon, isPassword, error, focused, className, props.disabled, props.value])}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}))

Input.displayName = "Input"

export { Input }