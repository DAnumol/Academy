import { motion } from 'framer-motion'
import ExamTable from '../components/ExamTable'

const ExamPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <ExamTable />
    </motion.div>
  )
}

export default ExamPage