import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumbs from './Breadcrumbs'
import { useUIStore } from '@/store/uiStore'
import { useTheme } from '@hooks/useTheme'
import { cn } from '@utils/cn'

const DashboardLayout = () => {
  const { sidebarCollapsed } = useUIStore()
  const { isDark } = useTheme()



  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <motion.main
          className={cn(
            "flex-1 overflow-auto p-4 lg:p-6 transition-all duration-300",
            "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="pb-8">
              <Breadcrumbs />
            </div>
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

export default DashboardLayout