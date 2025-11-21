import { motion } from 'framer-motion'
import SubjectTable from '../components/SubjectTable'

const SubjectPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <SubjectTable />
    </motion.div>
  )
}

export default SubjectPage