import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Globe, Shield, Eye, Palette, Volume2, Smartphone } from 'lucide-react'

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      desktop: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      dataCollection: false
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium'
    },
    sound: {
      notifications: true,
      volume: 75
    }
  })

  const updatePreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const updateSimplePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const PreferenceSection = ({ title, icon: Icon, children }) => (
    <div className="card-floating p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Preferences</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreferenceSection title="Appearance" icon={Palette}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => updateSimplePreference('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => updateSimplePreference('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </PreferenceSection>

        <PreferenceSection title="Notifications" icon={Bell}>
          <ToggleSwitch
            enabled={preferences.notifications.email}
            onChange={(value) => updatePreference('notifications', 'email', value)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          
          <ToggleSwitch
            enabled={preferences.notifications.push}
            onChange={(value) => updatePreference('notifications', 'push', value)}
            label="Push Notifications"
            description="Receive push notifications on your device"
          />
          
          <ToggleSwitch
            enabled={preferences.notifications.desktop}
            onChange={(value) => updatePreference('notifications', 'desktop', value)}
            label="Desktop Notifications"
            description="Show notifications on your desktop"
          />
          
          <ToggleSwitch
            enabled={preferences.notifications.marketing}
            onChange={(value) => updatePreference('notifications', 'marketing', value)}
            label="Marketing Emails"
            description="Receive promotional and marketing emails"
          />
        </PreferenceSection>

        <PreferenceSection title="Privacy" icon={Shield}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => updatePreference('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <ToggleSwitch
            enabled={preferences.privacy.activityStatus}
            onChange={(value) => updatePreference('privacy', 'activityStatus', value)}
            label="Show Activity Status"
            description="Let others see when you're online"
          />
          
          <ToggleSwitch
            enabled={preferences.privacy.dataCollection}
            onChange={(value) => updatePreference('privacy', 'dataCollection', value)}
            label="Data Collection"
            description="Allow collection of usage data for improvements"
          />
        </PreferenceSection>

        <PreferenceSection title="Accessibility" icon={Eye}>
          <ToggleSwitch
            enabled={preferences.accessibility.reducedMotion}
            onChange={(value) => updatePreference('accessibility', 'reducedMotion', value)}
            label="Reduced Motion"
            description="Minimize animations and transitions"
          />
          
          <ToggleSwitch
            enabled={preferences.accessibility.highContrast}
            onChange={(value) => updatePreference('accessibility', 'highContrast', value)}
            label="High Contrast"
            description="Increase contrast for better visibility"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <select
              value={preferences.accessibility.fontSize}
              onChange={(e) => updatePreference('accessibility', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </PreferenceSection>

        <PreferenceSection title="Sound" icon={Volume2}>
          <ToggleSwitch
            enabled={preferences.sound.notifications}
            onChange={(value) => updatePreference('sound', 'notifications', value)}
            label="Notification Sounds"
            description="Play sounds for notifications"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume ({preferences.sound.volume}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.sound.volume}
              onChange={(e) => updatePreference('sound', 'volume', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </PreferenceSection>

        <div className="card-floating p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mobile App
            </h3>
          </div>
          
          <div className="text-center py-8">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Download Our Mobile App
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get the full experience on your mobile device
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-primary text-sm">
                App Store
              </button>
              <button className="btn-secondary text-sm">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">
          Save Preferences
        </button>
      </div>
    </motion.div>
  )
}

export default Preferences