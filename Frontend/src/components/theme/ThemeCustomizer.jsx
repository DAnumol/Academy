import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Palette, Type, Layout, Save, RotateCcw, Download, Upload } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import toast from 'react-hot-toast'

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const { colors, typography, layout, updateColors, updateTypography, updateLayout, resetTheme, exportTheme, importTheme } = useThemeStore()
  const [activeSection, setActiveSection] = useState('colors')

  const colorSections = [
    { key: 'primary', label: 'Primary', desc: 'Main brand color' },
    { key: 'secondary', label: 'Secondary', desc: 'Accent color' },
    { key: 'success', label: 'Success', desc: 'Success states' },
    { key: 'warning', label: 'Warning', desc: 'Warning states' },
    { key: 'error', label: 'Error', desc: 'Error states' },
    { key: 'info', label: 'Info', desc: 'Info states' },
    { key: 'background', label: 'Background', desc: 'Page background' },
    { key: 'surface', label: 'Surface', desc: 'Card background' },
    { key: 'text', label: 'Text', desc: 'Text color' },
    { key: 'border', label: 'Border', desc: 'Border color' },
    { key: 'sidebar', label: 'Sidebar', desc: 'Sidebar background' },
    { key: 'header', label: 'Header', desc: 'Header background' }
  ]

  const ColorPicker = ({ label, value, onChange, description }) => (
    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-white">{label}</label>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
          style={{ minWidth: '100px' }}
        />
        <div className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" style={{ backgroundColor: value }} />
      </div>
    </div>
  )

  const handleSave = () => {
    toast.success('Theme saved successfully!')
  }

  const handleReset = () => {
    resetTheme()
    toast.success('Theme reset to default')
  }

  const handleExport = () => {
    exportTheme()
    toast.success('Theme exported!')
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          importTheme(event.target.result)
          toast.success('Theme imported successfully!')
        } catch {
          toast.error('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customizer</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customize every aspect of your interface</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex" style={{ height: 'calc(90vh - 200px)' }}>
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2 flex-shrink-0">
            {[
              { id: 'colors', icon: Palette, label: 'Colors' },
              { id: 'typography', icon: Type, label: 'Typography' },
              { id: 'layout', icon: Layout, label: 'Layout' }
            ].map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {colorSections.map((section) => (
                    <ColorPicker
                      key={section.key}
                      label={section.label}
                      description={section.desc}
                      value={colors[section.key] || '#000000'}
                      onChange={(value) => updateColors({ [section.key]: value })}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'typography' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={typography?.fontFamily || 'Inter'}
                    onChange={(e) => updateTypography({ fontFamily: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Base Font Size</label>
                  <select
                    value={typography?.fontSize || 'medium'}
                    onChange={(e) => updateTypography({ fontSize: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="small">Small (14px)</option>
                    <option value="medium">Medium (16px)</option>
                    <option value="large">Large (18px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Weight</label>
                  <select
                    value={typography?.fontWeight || 'normal'}
                    onChange={(e) => updateTypography({ fontWeight: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light (300)</option>
                    <option value="normal">Normal (400)</option>
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">Semibold (600)</option>
                    <option value="bold">Bold (700)</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'layout' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Border Radius</label>
                  <select
                    value={layout?.borderRadius || 'medium'}
                    onChange={(e) => updateLayout({ borderRadius: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="none">None (0px)</option>
                    <option value="small">Small (4px)</option>
                    <option value="medium">Medium (8px)</option>
                    <option value="large">Large (12px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Spacing</label>
                  <select
                    value={layout?.spacing || 'medium'}
                    onChange={(e) => updateLayout({ spacing: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="tight">Tight</option>
                    <option value="medium">Medium</option>
                    <option value="loose">Loose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shadows</label>
                  <select
                    value={layout?.shadows || 'medium'}
                    onChange={(e) => updateLayout({ shadows: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="none">None</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button onClick={handleExport} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Theme
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ThemeCustomizer
