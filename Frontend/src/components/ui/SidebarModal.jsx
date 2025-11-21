import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const SidebarModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0" style={{ zIndex: 99999 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-900 shadow-2xl"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default SidebarModal