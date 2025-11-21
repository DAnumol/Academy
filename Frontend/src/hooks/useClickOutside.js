import { useEffect } from 'react'

/**
 * Custom hook to detect clicks outside of a referenced element
 * Useful for closing dropdowns, modals, and other overlay components
 * 
 * @param {React.RefObject} ref - React ref object pointing to the element
 * @param {Function} handler - Callback function to execute when clicking outside
 * @param {Array} dependencies - Optional dependencies array for the effect
 */
export const useClickOutside = (ref, handler, dependencies = []) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the ref exists and the clicked element is not inside the ref
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event)
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, handler, ...dependencies])
}