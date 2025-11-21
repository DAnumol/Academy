import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CenterModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

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
        
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`w-full ${sizeClasses[size]} max-h-[90vh] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200/30">
              <h3 className="text-xl font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CenterModal;