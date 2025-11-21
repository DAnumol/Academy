import { motion } from 'framer-motion'
import TaskTable from '../components/TaskTable'

const TasksPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <TaskTable />
    </motion.div>
  )
}

export default TasksPage