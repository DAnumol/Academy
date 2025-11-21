import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { THEMES } from '@/utils/constants'
import { X, Type, Layout, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const ThemeCustomizer = ({ isOpen, onClose }) => {
  const {
    typography,
    layout,
    updateTypography,
    updateLayout,
    resetTheme
  } = useThemeStore()

  const [activeTab, setActiveTab] = useState('typography')
  const [previewMode, setPreviewMode] = useState(false)

  const tabs = [
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-background)] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <Type className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Theme Customizer</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? 'Exit Preview' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetTheme}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-[var(--color-border)] p-4">
            {/* Navigation */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-text)]">Font Settings</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Family</label>
                      <select
                        value={typography.fontFamily}
                        onChange={(e) => updateTypography({ fontFamily: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size</label>
                      <select
                        value={typography.fontSize}
                        onChange={(e) => updateTypography({ fontSize: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Weight</label>
                      <select
                        value={typography.fontWeight}
                        onChange={(e) => updateTypography({ fontWeight: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="light">Light</option>
                        <option value="normal">Normal</option>
                        <option value="medium">Medium</option>
                        <option value="semibold">Semi Bold</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-text)]">Preview</h3>
                    <div className="p-4 rounded-lg border bg-[var(--color-surface)]">
                      <h1 className="text-2xl font-bold mb-2">Heading 1</h1>
                      <h2 className="text-xl font-semibold mb-2">Heading 2</h2>
                      <p className="text-base mb-2">Regular paragraph text with normal weight.</p>
                      <p className="text-sm text-[var(--color-textSecondary)]">Small secondary text.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-text)]">Layout Settings</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Border Radius</label>
                      <select
                        value={layout.borderRadius}
                        onChange={(e) => updateLayout({ borderRadius: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                        <option value="full">Full</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Spacing</label>
                      <select
                        value={layout.spacing}
                        onChange={(e) => updateLayout({ spacing: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="tight">Tight</option>
                        <option value="medium">Medium</option>
                        <option value="loose">Loose</option>
                        <option value="xloose">Extra Loose</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Shadows</label>
                      <select
                        value={layout.shadows}
                        onChange={(e) => updateLayout({ shadows: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                      >
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-[var(--color-text)]">Preview</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)]" style={{ borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-base)' }}>
                        Card with current settings
                      </div>
                      <Button variant="primary">Button Preview</Button>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-[var(--color-primary)]" style={{ borderRadius: 'var(--border-radius)' }} />
                        <div className="w-8 h-8 bg-[var(--color-secondary)]" style={{ borderRadius: 'var(--border-radius)' }} />
                        <div className="w-8 h-8 bg-[var(--color-accent)]" style={{ borderRadius: 'var(--border-radius)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}