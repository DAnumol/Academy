import { motion } from 'framer-motion'
import ResultTable from '../components/ResultTable'

const ResultPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <ResultTable />
    </motion.div>
  )
}

export default ResultPage