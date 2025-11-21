import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Route to breadcrumb mapping
 * Maps URL paths to human-readable breadcrumb labels
 */
const routeMap = {
  '/dashboard': 'Dashboard',
  '/dashboard/analytics': 'Analytics Overview',
  '/dashboard/performance': 'Performance Metrics',
  '/users': 'User Management',
  '/users/roles': 'Role Management',
  '/settings': 'Settings',
  '/reports': 'Reports',
  '/help': 'Help & Support'
}

/**
 * Breadcrumbs Component
 * Dynamic breadcrumb navigation based on current route
 */
const Breadcrumbs = () => {
  const location = useLocation()
  
  // Generate breadcrumb items from current path
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const items = []
    
    // Always start with home
    items.push({
      label: 'Home',
      path: '/dashboard',
      icon: Home
    })
    
    // Build breadcrumbs from path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Get label from route map or format segment
      const label = routeMap[currentPath] || 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      
      items.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      })
    })
    
    return items
  }, [location.pathname])
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm">
      {breadcrumbs.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          )}
          
          {item.isLast ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-1">
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150 flex items-center gap-1"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  )
}

export default React.memo(Breadcrumbs)