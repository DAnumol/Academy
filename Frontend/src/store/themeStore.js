// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { STORAGE_KEYS, THEMES } from '@utils/constants'

// export const useThemeStore = create(
//   persist(
//     (set, get) => ({
//       mode: THEMES.SYSTEM,
//       isDark: false,
//       typography: {
//         fontFamily: 'Inter',
//         fontSize: 'medium',
//         fontWeight: 'normal'
//       },
//       layout: {
//         borderRadius: 'medium',
//         spacing: 'medium',
//         shadows: 'medium'
//       },
      
//       setThemeMode: (newTheme) => {
//         set({ mode: newTheme })
//         get().applyTheme()
//       },
      
//       updateTypography: (typography) => {
//         console.log('updateTypography called with:', typography)
//         set({ typography: { ...get().typography, ...typography } })
//         console.log('New typography state:', get().typography)
//         get().applyTheme()
//       },
      
//       updateLayout: (layout) => {
//         set({ layout: { ...get().layout, ...layout } })
//         get().applyTheme()
//       },
      
//       applyTheme: () => {
//         const state = get()
//         const root = document.documentElement
        
//         let isDark = false
//         if (state.mode === THEMES.SYSTEM) {
//           isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//         } else {
//           isDark = state.mode === THEMES.DARK
//         }
        
//         set({ isDark })
        
//         if (isDark) {
//           root.classList.add('dark')
//         } else {
//           root.classList.remove('dark')
//         }
        
//         // Apply typography
//         const fontFamily = state.typography.fontFamily
//         const fontSize = get().getFontSizeValue(state.typography.fontSize)
//         const fontWeight = get().getFontWeightValue(state.typography.fontWeight)
        
//         console.log('Applying typography:', { fontFamily, fontSize, fontWeight })
        
//         root.style.setProperty('--font-family', fontFamily)
//         root.style.setProperty('--font-size-base', fontSize)
//         root.style.setProperty('--font-weight-base', fontWeight)
        
//         // Apply layout
//         const borderRadius = get().getBorderRadiusValue(state.layout.borderRadius)
//         const spacing = get().getSpacingValue(state.layout.spacing)
//         const shadow = get().getShadowValue(state.layout.shadows)
        
//         console.log('Applying layout:', { borderRadius, spacing, shadow })
        
//         root.style.setProperty('--border-radius', borderRadius)
//         root.style.setProperty('--spacing-base', spacing)
//         root.style.setProperty('--shadow-base', shadow)
//       },
      
//       getFontSizeValue: (size) => {
//         const sizes = {
//           small: '14px',
//           medium: '16px',
//           large: '18px'
//         }
//         return sizes[size] || sizes.medium
//       },
      
//       getFontWeightValue: (weight) => {
//         const weights = {
//           light: '300',
//           normal: '400',
//           medium: '500',
//           semibold: '600',
//           bold: '700'
//         }
//         return weights[weight] || weights.normal
//       },
      
//       getBorderRadiusValue: (radius) => {
//         const radii = {
//           none: '0px',
//           small: '4px',
//           medium: '8px',
//           large: '12px'
//         }
//         return radii[radius] || radii.medium
//       },
      
//       getSpacingValue: (spacing) => {
//         const spacings = {
//           tight: '0.5rem',
//           medium: '1rem',
//           loose: '1.5rem'
//         }
//         return spacings[spacing] || spacings.medium
//       },
      
//       getShadowValue: (shadow) => {
//         const shadows = {
//           none: 'none',
//           small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
//           medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//           large: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
//         }
//         return shadows[shadow] || shadows.medium
//       },
      
//       initializeTheme: () => {
//         get().applyTheme()
        
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//         const handleChange = () => {
//           if (get().mode === THEMES.SYSTEM) {
//             get().applyTheme()
//           }
//         }
        
//         mediaQuery.addEventListener('change', handleChange)
//         return () => mediaQuery.removeEventListener('change', handleChange)
//       },
      
//       // Legacy support
//       theme: THEMES.SYSTEM,
//       setTheme: (newTheme) => get().setThemeMode(newTheme),
//       toggleTheme: () => {
//         const newMode = get().mode === 'light' ? 'dark' : 'light'
//         get().setThemeMode(newMode)
//       }
//     }),
//     {
//       name: STORAGE_KEYS.THEME,
//       partialize: (state) => ({ 
//         mode: state.mode, 
//         typography: state.typography, 
//         layout: state.layout 
//       })
//     }
//   )
// )




import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, THEMES } from '@utils/constants'

const defaultColors = {
  primary: '#0ea5e9',
  secondary: '#d946ef',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#111827',
  border: '#e5e7eb',
  sidebar: '#ffffff',
  header: '#ffffff'
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: THEMES.SYSTEM,
      isDark: false,
      colors: defaultColors,
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
      
      updateColors: (colors) => {
        set({ colors: { ...get().colors, ...colors } })
        get().applyTheme()
        get().saveToBackend()
      },
      
      updateTypography: (typography) => {
        set({ typography: { ...get().typography, ...typography } })
        get().applyTheme()
        get().saveToBackend()
      },
      
      updateLayout: (layout) => {
        set({ layout: { ...get().layout, ...layout } })
        get().applyTheme()
        get().saveToBackend()
      },
      
      resetTheme: () => {
        set({ 
          colors: defaultColors, 
          typography: { fontFamily: 'Inter', fontSize: 'medium', fontWeight: 'normal' }, 
          layout: { borderRadius: 'medium', spacing: 'medium', shadows: 'medium' },
          mode: 'light'
        })
        get().applyTheme()
        get().saveToBackend()
      },
      
      exportTheme: () => {
        const theme = { colors: get().colors, typography: get().typography, layout: get().layout }
        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'theme.json'
        a.click()
        URL.revokeObjectURL(url)
      },
      
      importTheme: (jsonString) => {
        const theme = JSON.parse(jsonString)
        if (theme.colors) set({ colors: theme.colors })
        if (theme.typography) set({ typography: theme.typography })
        if (theme.layout) set({ layout: theme.layout })
        get().applyTheme()
        get().saveToBackend()
      },
      
      saveToBackend: async () => {
        try {
          const { themeService } = await import('@/services/themeService')
          const state = get()
          let mode = state.mode?.toLowerCase() || 'system'
          // Validate mode is one of: light, dark, system
          if (!['light', 'dark', 'system'].includes(mode)) {
            mode = 'system'
          }
          await themeService.updateThemePreference({
            colors: state.colors,
            typography: state.typography,
            layout: state.layout,
            mode: mode
          })
        } catch (error) {
          console.error('Failed to save theme to backend:', error)
        }
      },
      
      loadFromBackend: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
          get().applyTheme()
          return
        }
        try {
          const { themeService } = await import('@/services/themeService')
          const response = await themeService.getThemePreference()
          if (response.success && response.data) {
            const { colors, typography, layout, mode } = response.data
            if (colors) set({ colors, typography, layout, mode })
            get().applyTheme()
          }
        } catch (error) {
          console.error('Failed to load theme from backend:', error)
          get().applyTheme()
        }
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
        
        // Apply colors as CSS variables
        Object.entries(state.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value)
        })
        
        // Apply primary and secondary to Tailwind color variables
        root.style.setProperty('--tw-primary', state.colors.primary)
        root.style.setProperty('--tw-secondary', state.colors.secondary)
        
        // Override common Tailwind classes
        const style = document.getElementById('dynamic-theme-style') || document.createElement('style')
        style.id = 'dynamic-theme-style'
        
        // Use pure black for sidebar/header/background in dark mode, custom colors in light mode
        const sidebarColor = isDark ? '#000000' : state.colors.sidebar
        const headerColor = isDark ? '#000000' : state.colors.header
        const surfaceColor = isDark ? '#000000' : state.colors.surface
        const backgroundColor = isDark ? '#000000' : state.colors.background
        
        style.innerHTML = `
          /* Primary */
          .bg-primary-500, .bg-blue-500 { background-color: ${state.colors.primary} !important; }
          .bg-primary-600, .bg-blue-600 { background-color: ${state.colors.primary} !important; filter: brightness(0.9); }
          .text-primary-500, .text-blue-500 { color: ${state.colors.primary} !important; }
          .border-primary-500 { border-color: ${state.colors.primary} !important; }
          .from-primary-500, .from-blue-500 { --tw-gradient-from: ${state.colors.primary} !important; }
          .hover\\:bg-primary-600:hover, .hover\\:bg-blue-600:hover { background-color: ${state.colors.primary} !important; filter: brightness(0.9); }
          
          /* Secondary */
          .bg-secondary-500, .bg-purple-500 { background-color: ${state.colors.secondary} !important; }
          .bg-secondary-600, .bg-purple-600 { background-color: ${state.colors.secondary} !important; filter: brightness(0.9); }
          .text-secondary-500 { color: ${state.colors.secondary} !important; }
          .to-secondary-500, .to-purple-500 { --tw-gradient-to: ${state.colors.secondary} !important; }
          
          /* Success */
          .bg-green-500, .bg-emerald-500 { background-color: ${state.colors.success} !important; }
          .bg-green-600, .bg-emerald-600 { background-color: ${state.colors.success} !important; filter: brightness(0.9); }
          .text-green-500, .text-emerald-500 { color: ${state.colors.success} !important; }
          .from-green-500 { --tw-gradient-from: ${state.colors.success} !important; }
          
          /* Warning */
          .bg-yellow-500, .bg-orange-500 { background-color: ${state.colors.warning} !important; }
          .bg-yellow-600, .bg-orange-600 { background-color: ${state.colors.warning} !important; filter: brightness(0.9); }
          .text-yellow-500, .text-orange-500 { color: ${state.colors.warning} !important; }
          
          /* Error */
          .bg-red-500 { background-color: ${state.colors.error} !important; }
          .bg-red-600 { background-color: ${state.colors.error} !important; filter: brightness(0.9); }
          .text-red-500 { color: ${state.colors.error} !important; }
          
          /* Info */
          .bg-blue-400 { background-color: ${state.colors.info} !important; }
          .text-blue-400 { color: ${state.colors.info} !important; }
          
          /* Background & Surface */
          .bg-gray-50 { background-color: ${state.colors.surface} !important; }
          .bg-white { background-color: ${state.colors.background} !important; }
          main { background-color: ${state.colors.background} !important; }
          
          /* Text */
          .text-gray-900 { color: ${state.colors.text} !important; }
          .dark .text-gray-900, .dark .text-gray-800, .dark .text-gray-700 { color: #ffffff !important; }
          .dark body, .dark p, .dark span, .dark div { color: #ffffff !important; }
          
          /* Border */
          .border-gray-200, .border-gray-300 { border-color: ${state.colors.border} !important; }
          
          /* Sidebar - target by structure */
          .fixed.left-0.z-50 { background-color: ${sidebarColor} !important; }
          nav.flex-1 { background-color: transparent !important; }
          
          /* Sidebar scrollbar */
          nav.flex-1::-webkit-scrollbar-thumb { background-color: ${isDark ? '#000000' : '#ffffff'} !important; }
          nav.flex-1::-webkit-scrollbar-track { background-color: ${sidebarColor} !important; }
          
          /* Header */
          .h-16.border-b { background-color: ${headerColor} !important; }
          header, .dark header { background-color: ${headerColor} !important; }
          .dark .bg-white { background-color: ${headerColor} !important; }
          
          /* Dark mode overrides */
          .dark .bg-gray-800, .dark .bg-gray-900 { background-color: ${surfaceColor} !important; }
          .dark .bg-gray-50, .dark body, .dark main { background-color: ${backgroundColor} !important; }
          .dark .min-h-screen { background-color: ${backgroundColor} !important; }
          .dark .bg-white, .dark .bg-gray-100 { background-color: ${backgroundColor} !important; }
          .dark .bg-gradient-to-br, .dark .bg-gradient-to-r { background: ${backgroundColor} !important; }
        `
        if (!document.head.contains(style)) {
          document.head.appendChild(style)
        }
        
        // Apply typography
        const fontFamily = state.typography.fontFamily
        const fontSize = get().getFontSizeValue(state.typography.fontSize)
        const fontWeight = get().getFontWeightValue(state.typography.fontWeight)
        
        root.style.setProperty('--font-family', fontFamily)
        root.style.setProperty('--font-size-base', fontSize)
        root.style.setProperty('--font-weight-base', fontWeight)
        
        // Apply layout
        const borderRadius = get().getBorderRadiusValue(state.layout.borderRadius)
        const spacing = get().getSpacingValue(state.layout.spacing)
        const shadow = get().getShadowValue(state.layout.shadows)
        
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
        const token = localStorage.getItem('token')
        if (token) {
          get().loadFromBackend().then(() => {
            get().applyTheme()
          }).catch(() => {
            get().applyTheme()
          })
        } else {
          get().applyTheme()
        }
        
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
        colors: state.colors,
        typography: state.typography, 
        layout: state.layout 
      })
    }
  )
)