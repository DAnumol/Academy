import { useState, memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, 
  Bell, 
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { ThemeToggle } from '@components/ui/ThemeToggle'
// Simple notification implementation
import { useUIStore } from '@/store/uiStore'
import { useTheme } from '@hooks/useTheme'
import { useAuth } from '@hooks/useAuth'
import { cn } from '@utils/cn'

const Header = memo(() => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { toggleMobileSidebar, notifications, getUnreadCount } = useUIStore()
  const { isDark } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const unreadCount = getUnreadCount()

  const handleLogout = useCallback(() => {
    logout()
    setShowUserMenu(false)
  }, [logout])

  const handleProfileClick = useCallback(() => {
    navigate('/profile')
    setShowUserMenu(false)
  }, [navigate])

  const handleSettingsClick = useCallback(() => {
    navigate('/settings')
    setShowUserMenu(false)
  }, [navigate])



  const toggleNotifications = useCallback(() => {
    setShowNotifications(!showNotifications)
  }, [showNotifications])

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(!showUserMenu)
  }, [showUserMenu])

  return (
    <header className="sticky top-0 z-40 w-full border-b" style={{ borderColor: 'var(--border-radius)', backgroundColor: 'var(--color-surface)', backdropFilter: 'blur(12px)' }}>
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              className="w-64 pl-10 bg-gray-50 dark:bg-gray-800 border-0"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle with customization */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer",
                            !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                          )}
                        >
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-3"
              onClick={toggleUserMenu}
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0ea5e9&color=fff`}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0ea5e9&color=fff` }}
              />
              <span className="hidden md:block font-medium">{user?.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button 
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  
                  <button 
                    onClick={handleSettingsClick}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
})

export default Header