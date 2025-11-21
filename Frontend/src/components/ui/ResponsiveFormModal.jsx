import { useEffect, useState } from 'react'
import BottomSheet from './BottomSheet'
import FullScreenModal from './FullScreenModal'

const ResponsiveFormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.classList.add('bottom-sheet-open')
    } else {
      document.body.classList.remove('bottom-sheet-open')
    }
    
    return () => {
      document.body.classList.remove('bottom-sheet-open')
    }
  }, [isOpen, isMobile])

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        {children}
      </BottomSheet>
    )
  }

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {children}
    </FullScreenModal>
  )
}

export default ResponsiveFormModal