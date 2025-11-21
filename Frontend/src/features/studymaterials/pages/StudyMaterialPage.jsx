import { motion } from 'framer-motion'
import StudyMaterialTable from '../components/StudyMaterialTable'


const StudyMaterialPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <StudyMaterialTable/>
    </motion.div>
  )
}

export default StudyMaterialPage