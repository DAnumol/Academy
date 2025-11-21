import { useState } from 'react'
import { Globe, Check } from 'lucide-react'


const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文'
}

export const LanguageSelector = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const locale = 'en'
  const availableLocales = ['en', 'es']
  const isLoading = false

  const handleLanguageChange = (newLocale) => {
    // Language change functionality removed
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        disabled={isLoading}
      >
        <Globe className="w-4 h-4" />
        <span>{LANGUAGE_NAMES[locale]}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {availableLocales.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  <span>{LANGUAGE_NAMES[lang]}</span>
                  {locale === lang && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}