import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  snapPoints = ['90%', '50%'],
  initialSnap = 0
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const sheetRef = useRef(null)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sheetVariants = {
    initial: {
      y: '100%'
    },
    animate: {
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      y: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            variants={sheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              setIsDragging(false)
              if (info.offset.y > 100) {
                onClose()
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[10000] bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div 
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => {
                setIsDragging(true)
                dragControls.start(e)
              }}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors hover:bg-gray-400 dark:hover:bg-gray-500" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <motion.h2 
                  className="text-xl font-bold gradient-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h2>
              )}
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>
            
            {/* Content */}
            <motion.div 
              className="flex-1 overflow-auto px-4 py-4 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default BottomSheet