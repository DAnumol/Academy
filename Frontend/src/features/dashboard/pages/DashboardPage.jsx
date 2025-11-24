import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, BookOpen, ClipboardList, TrendingUp, Award, Calendar, CheckCircle } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { CardSkeleton } from '@components/common/LoadingSpinner'
import { useStagger } from '@hooks/useAnimations'
import { useAuthStore } from '@/store/authStore'
import { dashboardService } from '@/services/dashboardService'
import { showToast } from '@/utils/toast'

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const containerRef = useStagger('.stat-card', { delay: 0.1 })
  const { user } = useAuthStore()
  
  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      let response
      if (user?.role === 'admin') {
        response = await dashboardService.getAdminDashboard()
      } else if (user?.role === 'staff') {
        response = await dashboardService.getStaffDashboard()
      } else if (user?.role === 'student') {
        response = await dashboardService.getStudentDashboard()
      }
      setDashboardData(response.data || response)
    } catch (error) {
      showToast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const renderAdminDashboard = () => (
    <>
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard className="stat-card" title="Total Students" value={dashboardData?.totalStudents || 0} icon={Users} />
        <StatsCard className="stat-card" title="Total Staff" value={dashboardData?.totalStaff || 0} icon={GraduationCap} />
        <StatsCard className="stat-card" title="Total Courses" value={dashboardData?.totalCourses || 0} icon={BookOpen} />
        <StatsCard className="stat-card" title="Total Batches" value={dashboardData?.totalBatches || 0} icon={ClipboardList} />
            {/* <StatsCard className="stat-card" title="Total Exams" value={dashboardData?.totalExams || 0} icon={ClipboardList} /> */}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Students</h3>
        <div className="space-y-2">
          {dashboardData?.recentStudents?.map(student => (
            <div key={student.studentId} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">{student.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{student.email}</span>
            </div>
          ))}
        </div>
      </div>
      
    </>
  )

  const renderStaffDashboard = () => (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard className="stat-card" title="Total Students" value={dashboardData?.totalStudents || 0} icon={Users} />
      <StatsCard className="stat-card" title="Total Batches" value={dashboardData?.totalBatches || 0} icon={ClipboardList} />
      <StatsCard className="stat-card" title="Total Exams" value={dashboardData?.totalExams || 0} icon={Calendar} />
      <StatsCard className="stat-card" title="Total Courses" value={dashboardData?.totalCourses || 0} icon={BookOpen} />
    </div>
  )

  const renderStudentDashboard = () => (
    <>
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard className="stat-card" title="Total Exams" value={dashboardData?.totalExams || 0} icon={ClipboardList} />
        <StatsCard className="stat-card" title="Attempted" value={dashboardData?.attemptedExams || 0} icon={CheckCircle} changeType="positive" />
        <StatsCard className="stat-card" title="Pending" value={dashboardData?.pendingExams || 0} icon={Calendar} changeType="negative" />
        <StatsCard className="stat-card" title="Avg Score" value={`${dashboardData?.avgPercentage || 0}%`} icon={Award} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
          <div className="space-y-2">
            {dashboardData?.upcomingExams?.length > 0 ? dashboardData.upcomingExams.map(exam => (
              <div key={exam.examId} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="font-medium">{exam.questionPaper?.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Date: {new Date(exam.date).toLocaleDateString()} | {exam.questionPaper?.duration} mins | {exam.questionPaper?.totalMarks} marks
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-4">No upcoming exams</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Latest Materials</h3>
          <div className="space-y-2">
            {dashboardData?.latestMaterials?.length > 0 ? dashboardData.latestMaterials.map(material => (
              <div key={material.materialId} className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <div className="font-medium">{material.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {material.subject?.name} | {new Date(material.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-4">No materials available</p>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
        <div className="space-y-2">
          {dashboardData?.recentResults?.length > 0 ? dashboardData.recentResults.map(result => (
            <div key={result.resultId} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">Grade: {result.grade}</span>
              <span className="text-sm">{result.obtainedMarks}/{result.totalMarks}</span>
              <span className={`text-sm font-semibold ${result.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                {result.percentage}%
              </span>
            </div>
          )) : <p className="text-gray-500 text-center py-4">No results yet</p>}
        </div>
      </div>
    </>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {dashboardData?.studentName || dashboardData?.staffName || 'Admin'}!
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <>
          {user?.role === 'admin' && renderAdminDashboard()}
          {user?.role === 'staff' && renderStaffDashboard()}
          {user?.role === 'student' && renderStudentDashboard()}
        </>
      )}
    </motion.div>
  )
}

export default DashboardPage