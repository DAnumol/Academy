import { motion } from 'framer-motion'
import ClassTable from '../components/ClassTable'

const ClassPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <ClassTable />
    </motion.div>
  )
}

export default ClassPage