import { motion } from 'framer-motion'
import TimeTable from '../components/TimeTable'


const TimeTablePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <TimeTable/>
    </motion.div>
  )
}

export default TimeTablePage