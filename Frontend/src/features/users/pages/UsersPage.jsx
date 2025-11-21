import { motion } from 'framer-motion'
import UserTable from '../components/UserTable'

const UsersPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <UserTable />
    </motion.div>
  )
}

export default UsersPage