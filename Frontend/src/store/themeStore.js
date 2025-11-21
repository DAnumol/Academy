import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, THEMES } from '@utils/constants'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: THEMES.SYSTEM,
      isDark: false,
      typography: {
        fontFamily: 'Inter',
        fontSize: 'medium',
        fontWeight: 'normal'
      },
      layout: {
        borderRadius: 'medium',
        spacing: 'medium',
        shadows: 'medium'
      },
      
      setThemeMode: (newTheme) => {
        set({ mode: newTheme })
        get().applyTheme()
      },
      
      updateTypography: (typography) => {
        console.log('updateTypography called with:', typography)
        set({ typography: { ...get().typography, ...typography } })
        console.log('New typography state:', get().typography)
        get().applyTheme()
      },
      
      updateLayout: (layout) => {
        set({ layout: { ...get().layout, ...layout } })
        get().applyTheme()
      },
      
      applyTheme: () => {
        const state = get()
        const root = document.documentElement
        
        let isDark = false
        if (state.mode === THEMES.SYSTEM) {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
          isDark = state.mode === THEMES.DARK
        }
        
        set({ isDark })
        
        if (isDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        
        // Apply typography
        const fontFamily = state.typography.fontFamily
        const fontSize = get().getFontSizeValue(state.typography.fontSize)
        const fontWeight = get().getFontWeightValue(state.typography.fontWeight)
        
        console.log('Applying typography:', { fontFamily, fontSize, fontWeight })
        
        root.style.setProperty('--font-family', fontFamily)
        root.style.setProperty('--font-size-base', fontSize)
        root.style.setProperty('--font-weight-base', fontWeight)
        
        // Apply layout
        const borderRadius = get().getBorderRadiusValue(state.layout.borderRadius)
        const spacing = get().getSpacingValue(state.layout.spacing)
        const shadow = get().getShadowValue(state.layout.shadows)
        
        console.log('Applying layout:', { borderRadius, spacing, shadow })
        
        root.style.setProperty('--border-radius', borderRadius)
        root.style.setProperty('--spacing-base', spacing)
        root.style.setProperty('--shadow-base', shadow)
      },
      
      getFontSizeValue: (size) => {
        const sizes = {
          small: '14px',
          medium: '16px',
          large: '18px'
        }
        return sizes[size] || sizes.medium
      },
      
      getFontWeightValue: (weight) => {
        const weights = {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
        return weights[weight] || weights.normal
      },
      
      getBorderRadiusValue: (radius) => {
        const radii = {
          none: '0px',
          small: '4px',
          medium: '8px',
          large: '12px'
        }
        return radii[radius] || radii.medium
      },
      
      getSpacingValue: (spacing) => {
        const spacings = {
          tight: '0.5rem',
          medium: '1rem',
          loose: '1.5rem'
        }
        return spacings[spacing] || spacings.medium
      },
      
      getShadowValue: (shadow) => {
        const shadows = {
          none: 'none',
          small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          large: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
        }
        return shadows[shadow] || shadows.medium
      },
      
      initializeTheme: () => {
        get().applyTheme()
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
          if (get().mode === THEMES.SYSTEM) {
            get().applyTheme()
          }
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      },
      
      // Legacy support
      theme: THEMES.SYSTEM,
      setTheme: (newTheme) => get().setThemeMode(newTheme),
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light'
        get().setThemeMode(newMode)
      }
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ 
        mode: state.mode, 
        typography: state.typography, 
        layout: state.layout 
      })
    }
  )
)