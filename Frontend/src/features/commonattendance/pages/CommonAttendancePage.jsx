import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import CommonAttendanceManager from '../components/CommonAttendanceManager'
import StudentAttendanceView from '../components/StudentAttendanceView'

const CommonAttendancePage = () => {
  const { user } = useAuthStore()
  const isStudent = user?.role === 'student'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {isStudent ? <StudentAttendanceView /> : <CommonAttendanceManager />}
    </motion.div>
  )
}

export default CommonAttendancePage