import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { attendanceService } from '@/services/attendanceService'

const StudentAttendanceView = () => {
  const { user } = useAuthStore()
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  console.log('User object:', user)
  const studentId = user?.studentProfile?.studentId || user?.studentId
  console.log('Student ID:', studentId)
  console.log('Selected Month:', selectedMonth + 1, 'Year:', selectedYear)

  const { data: attendanceData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['student-attendance', studentId, selectedMonth, selectedYear],
    queryFn: async () => {
      if (!studentId) {
        console.log('No studentId found')
        return []
      }
      console.log('Fetching attendance for:', studentId, 'Month:', selectedMonth + 1, 'Year:', selectedYear)
      try {
        const response = await attendanceService.getStudentAttendance(
          studentId,
          selectedMonth + 1,
          selectedYear
        )
        console.log('API Response:', response)
        const data = response.data?.data || response.data || response || []
        console.log('Processed data:', data)
        return data
      } catch (err) {
        console.error('API Error:', err)
        return []
      }
    },
    enabled: !!studentId,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  console.log('Attendance Data:', attendanceData)
  console.log('Is Loading:', isLoading)
  console.log('Error:', error)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()

  const attendanceMap = useMemo(() => {
    const map = {}
    if (Array.isArray(attendanceData)) {
      attendanceData.forEach(record => {
        const date = new Date(record.date).getDate()
        map[date] = record.attendanceStatus || record.status
      })
    }
    return map
  }, [attendanceData])

  const stats = useMemo(() => {
    if (!Array.isArray(attendanceData)) {
      return { present: 0, absent: 0, late: 0, total: 0, percentage: 0 }
    }
    const present = attendanceData.filter(r => r.attendanceStatus === 'Present' || r.status === 'Present').length
    const absent = attendanceData.filter(r => r.attendanceStatus === 'Absent' || r.status === 'Absent').length
    const late = attendanceData.filter(r => r.attendanceStatus === 'Late' || r.status === 'Late').length
    const total = attendanceData.length
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0
    return { present, absent, late, total, percentage }
  }, [attendanceData])

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
    setTimeout(() => refetch(), 100)
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
    setTimeout(() => refetch(), 100)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-500'
      case 'Absent': return 'bg-red-500'
      case 'Late': return 'bg-yellow-500'
      default: return 'bg-gray-200 dark:bg-gray-700'
    }
  }

  if (!studentId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg">No student ID found</p>
          <p className="text-gray-500 text-sm mt-2">Please contact administrator</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading attendance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">My Attendance</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your monthly attendance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-700"
        >
          <div className="text-sm text-green-600 dark:text-green-400">Present</div>
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-red-200 dark:border-red-700"
        >
          <div className="text-sm text-red-600 dark:text-red-400">Absent</div>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-yellow-200 dark:border-yellow-700"
        >
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Late</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-4 shadow-sm"
        >
          <div className="text-sm text-white/80">Attendance %</div>
          <div className="text-2xl font-bold text-white">{stats.percentage}%</div>
        </motion.div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Month/Year Selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(Number(e.target.value))
                setTimeout(() => refetch(), 100)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value))
                setTimeout(() => refetch(), 100)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1
            const status = attendanceMap[day]
            const isToday = day === currentDate.getDate() && 
                           selectedMonth === currentDate.getMonth() && 
                           selectedYear === currentDate.getFullYear()
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`aspect-square flex items-center justify-center rounded-lg border-2 ${
                  isToday ? 'border-primary-500' : 'border-transparent'
                } ${status ? getStatusColor(status) : 'bg-gray-100 dark:bg-gray-700'} ${
                  status ? 'text-white font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-600 dark:text-gray-400">No Record</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentAttendanceView
