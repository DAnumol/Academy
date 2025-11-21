import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { Sun, Moon, Monitor, Type, Layout, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const ThemeToggle = () => {
  const { mode, isDark, setThemeMode, typography, layout, updateTypography, updateLayout } = useThemeStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(mode)
    const nextIndex = (currentIndex + 1) % themes.length
    setThemeMode(themes[nextIndex])
  }

  return (
    <div className="flex items-center gap-2 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleTheme}
        className="w-9 h-9 p-0"
        title={`Current: ${mode} theme`}
      >
        {getIcon()}
      </Button>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 px-2"
        >
          <Type className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 top-10 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 z-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                  value={typography?.fontFamily || 'Inter'}
                  onChange={(e) => {
                    console.log('Updating font family:', e.target.value)
                    updateTypography({ fontFamily: e.target.value })
                  }}
                  className="w-full px-2 py-1 text-sm rounded border"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <select
                  value={typography?.fontSize || 'medium'}
                  onChange={(e) => {
                    console.log('Updating font size:', e.target.value)
                    updateTypography({ fontSize: e.target.value })
                  }}
                  className="w-full px-2 py-1 text-sm rounded border"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <select
                  value={layout?.borderRadius || 'medium'}
                  onChange={(e) => updateLayout({ borderRadius: e.target.value })}
                  className="w-full px-2 py-1 text-sm rounded border"
                >
                  <option value="none">None</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Spacing</label>
                <select
                  value={layout?.spacing || 'medium'}
                  onChange={(e) => updateLayout({ spacing: e.target.value })}
                  className="w-full px-2 py-1 text-sm rounded border"
                >
                  <option value="tight">Tight</option>
                  <option value="medium">Medium</option>
                  <option value="loose">Loose</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}