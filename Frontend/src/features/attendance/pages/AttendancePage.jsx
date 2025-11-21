import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import AttendanceManager from '../components/AttendanceManager'
import StudentAttendanceView from '../components/StudentAttendanceView'

const AttendancePage = () => {
  const { user } = useAuthStore()
  const isStudent = user?.role === 'student'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {isStudent ? <StudentAttendanceView /> : <AttendanceManager />}
    </motion.div>
  )
}

export default AttendancePage