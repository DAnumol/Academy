import { motion } from 'framer-motion'

import BatchTable from '../components/BatchTable'

const BatchPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BatchTable/>
    </motion.div>
  )
}

export default BatchPage