import { motion } from 'framer-motion'
import QuestionPaperTable from '../components/QuestionPaperTable'


const QuestionPaperPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <QuestionPaperTable/>
    </motion.div>
  )
}

export default QuestionPaperPage