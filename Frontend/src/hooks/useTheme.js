import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export const useTheme = () => {
  const {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme
  } = useThemeStore()

  useEffect(() => {
    const cleanup = initializeTheme()
    return cleanup
  }, [initializeTheme])

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}