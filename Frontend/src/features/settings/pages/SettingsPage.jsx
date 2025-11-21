import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe, Camera, Save, Check, Crown, ArrowRight } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from '@hooks/useTranslation'
import { useFeatureFlags } from '@hooks/useFeatureFlags'
import { useNavigate } from 'react-router-dom'
import { backupService } from '@/services/backupService'
import { ROUTES } from '@utils/constants'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { isEnabled } = useFeatureFlags()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      title: 'Senior Developer',
      department: 'Engineering'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      taskUpdates: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-purple-500 to-pink-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'from-orange-500 to-red-500' },
    { id: 'preferences', label: 'Preferences', icon: Globe, color: 'from-indigo-500 to-purple-500' }
  ]

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }
  
  const handleBackup = async () => {
    try {
      await backupService.createBackup()
      toast.success('Backup created successfully!')
    } catch (error) {
      toast.error('Backup failed. Please try again.')
    }
  }
  
  const handleRestore = async (file) => {
    try {
      await backupService.restoreBackup(file)
      toast.success('Data restored successfully!')
    } catch (error) {
      toast.error('Restore failed. Please check the file.')
    }
  }

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
      </label>
    </div>
  )

  const renderTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab)
    
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 p-8 text-white">
              <div className="relative z-10 flex items-center gap-6">
                <div className="relative">
                  <img
                    src={settings.profile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl"
                  />
                  <button className="absolute -bottom-2 -right-2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{settings.profile.name}</h2>
                  <p className="text-white/80 mb-2">{settings.profile.title}</p>
                  <p className="text-white/60">{settings.profile.department}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={settings.profile.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, name: e.target.value } }))}
                  className="bg-white dark:bg-gray-800 border-0 shadow-sm text-gray-900 dark:text-white"
                />
                <Input
                  label="Job Title"
                  value={settings.profile.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, title: e.target.value } }))}
                  className="bg-white dark:bg-gray-800 border-0 shadow-sm text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, email: e.target.value } }))}
                  className="bg-white dark:bg-gray-800 border-0 shadow-sm text-gray-900 dark:text-white"
                />
                <Input
                  label="Department"
                  value={settings.profile.department}
                  onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, department: e.target.value } }))}
                  className="bg-white dark:bg-gray-800 border-0 shadow-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )
      
      case 'notifications':
        return (
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.notifications.emailNotifications}
              label="Email Notifications"
              description="Receive important updates via email"
            />
            <ToggleSwitch
              checked={settings.notifications.pushNotifications}
              label="Push Notifications"
              description="Get instant notifications on your device"
            />
            <ToggleSwitch
              checked={settings.notifications.taskUpdates}
              label="Task Updates"
              description="Notifications when tasks are assigned or updated"
            />
            <ToggleSwitch
              checked={settings.notifications.systemAlerts}
              label="System Alerts"
              description="Important system maintenance and security alerts"
            />
          </div>
        )
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Two-Factor Authentication</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Secure your account with 2FA</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  {settings.security.twoFactorAuth ? 'Enabled' : 'Enable'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.sessionTimeout')}
                </label>
                <select className="w-full px-3 py-2 border-0 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
              
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.passwordExpiry')}
                </label>
                <select className="w-full px-3 py-2 border-0 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                  <option>90 days</option>
                  <option>60 days</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
            
            <Button variant="outline" className="w-full py-3 rounded-xl">
              Change Password
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleBackup} variant="outline" className="py-3 rounded-xl">
                Create Backup
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => e.target.files[0] && handleRestore(e.target.files[0])}
                  className="hidden"
                />
                <Button as="span" variant="outline" className="w-full py-3 rounded-xl">
                  Restore Backup
                </Button>
              </label>
            </div>
          </div>
        )
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">Theme Mode</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Choose your preferred theme</p>
                </div>
                <Button onClick={toggleTheme} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Accent Colors</h3>
              <div className="grid grid-cols-4 gap-4">
                {['blue', 'purple', 'green', 'orange', 'red', 'pink', 'indigo', 'teal'].map(color => (
                  <button
                    key={color}
                    className={`aspect-square rounded-xl bg-${color}-500 hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'preferences':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.language')}</label>
              <select className="w-full px-3 py-2 border-0 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.timezone')}</label>
              <select className="w-full px-3 py-2 border-0 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                <option>UTC</option>
                <option>Eastern Time</option>
                <option>Pacific Time</option>
              </select>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.dateFormat')}</label>
              <select className="w-full px-3 py-2 border-0 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="sticky top-6 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white dark:bg-gray-800 shadow-lg scale-105'
                        : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                    whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tab.color} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">{tab.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tab.id === 'profile' && 'Personal information'}
                        {tab.id === 'notifications' && 'Alert preferences'}
                        {tab.id === 'security' && 'Account security'}
                        {tab.id === 'appearance' && 'Theme & colors'}
                        {tab.id === 'preferences' && 'General settings'}
                      </p>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full ml-auto"
                      />
                    )}
                  </motion.button>
                )
              })}
              
              {/* Upgrade Plan Link */}
              {isEnabled('premium_features') && (
                <motion.button
                  onClick={() => navigate(ROUTES.UPGRADE)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold">Upgrade Plan</p>
                    <p className="text-sm text-white/80">Unlock premium features</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>

              {/* Save Button */}
              <motion.div 
                className="mt-8 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  onClick={handleSave} 
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsPage