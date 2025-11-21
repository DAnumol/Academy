import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { attendanceService } from '../../../services/attendanceService'
import { apiClient } from '../../../services/apiClient'
import toast from 'react-hot-toast'

const AttendanceManager = () => {
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [subjects, setSubjects] = useState([])
  const [attendance, setAttendance] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load batches and subjects on component mount
  useEffect(() => {
    loadBatches()
    loadSubjects()
  }, [])

  // Load students when batch is selected
  useEffect(() => {
    if (selectedBatch) {
      loadStudents()
    }
  }, [selectedBatch])

  // Load existing attendance when batch, subject, and date are selected
  useEffect(() => {
    if (selectedBatch && selectedSubject && selectedDate) {
      loadExistingAttendance()
    }
  }, [selectedBatch, selectedSubject, selectedDate])

  const loadBatches = async () => {
    try {
      const response = await apiClient.get('/batches')
      const batchData = response.data?.batches || response.data || []
      setBatches(batchData)
    } catch (error) {
      console.error('Error loading batches:', error)
      toast.error('Failed to load batches')
    }
  }

  const loadSubjects = async () => {
    try {
      const response = await apiClient.get('/subjects')
      const subjectData = response.data?.subjects || response.data || []
      setSubjects(subjectData)
    } catch (error) {
      console.error('Error loading subjects:', error)
      toast.error('Failed to load subjects')
    }
  }

  const loadStudents = async () => {
    if (!selectedBatch) return
    
    setIsLoading(true)
    try {
      const response = await apiClient.get('/students')
      const allStudents = response.data?.students || response.data || []
      const batchStudents = allStudents.filter(student => student.batchId === selectedBatch)
      setStudents(batchStudents)
      
      // Reset attendance state - don't initialize with default values
      setAttendance({})
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Failed to load students')
    } finally {
      setIsLoading(false)
    }
  }

  const loadExistingAttendance = async () => {
    try {
      const response = await apiClient.get('/attendance', {
        params: {
          batchId: selectedBatch,
          subjectId: selectedSubject,
          date: selectedDate
        }
      })
      
      const attendanceData = response.data?.attendance || []
      if (attendanceData.length > 0) {
        // Load existing attendance records
        const existingAttendance = {}
        attendanceData[0].records.forEach(record => {
          existingAttendance[record.studentId] = record.attendanceStatus
        })
        setAttendance(existingAttendance)
      } else {
        // No existing attendance - clear attendance state
        setAttendance({})
      }
    } catch (error) {
      console.error('Error loading existing attendance:', error)
      // If error loading, clear attendance state
      setAttendance({})
    }
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => {
      const newAttendance = { ...prev, [studentId]: status }
      
      // If this is the first attendance being marked, initialize all other students as 'Present'
      if (Object.keys(prev).length === 0) {
        students.forEach(student => {
          if (student.studentId !== studentId && !newAttendance[student.studentId]) {
            newAttendance[student.studentId] = 'Present'
          }
        })
      }
      
      return newAttendance
    })
  }

  const handleSaveAttendance = async () => {
    if (!selectedBatch || !selectedSubject || !selectedDate) {
      toast.error('Please select batch, subject, and date')
      return
    }

    if (students.length === 0) {
      toast.error('No students found for selected batch')
      return
    }

    setIsSaving(true)
    try {
      const records = students.map(student => ({
        studentId: student.studentId,
        attendanceStatus: attendance[student.studentId] || 'Present'
      }))

      const attendanceData = {
        batchId: selectedBatch,
        subjectId: selectedSubject,
        date: selectedDate,
        records: records,
        status: 'Active'
      }

      await attendanceService.create(attendanceData)
      toast.success('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast.error('Failed to save attendance')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800 border-green-200'
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200'
      case 'Late': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAttendanceStats = () => {
    const total = students.length
    const attendanceValues = Object.values(attendance)
    
    // Always show stats when students are loaded
    if (attendanceValues.length === 0) {
      return { total, present: 0, absent: 0, late: 0, hasData: true }
    }
    
    const present = attendanceValues.filter(status => status === 'Present').length
    const absent = attendanceValues.filter(status => status === 'Absent').length
    const late = attendanceValues.filter(status => status === 'Late').length
    
    return { total, present, absent, late, hasData: true }
  }

  const stats = getAttendanceStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Mark student attendance for classes</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Selection Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Class Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose Batch</option>
              {batches.map(batch => (
                <option key={batch.batchId} value={batch.batchId}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose Subject</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Late</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.late}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student List */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
          </div>
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newAttendance = {}
                    students.forEach(student => {
                      newAttendance[student.studentId] = 'Present'
                    })
                    setAttendance(newAttendance)
                  }}
                  className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => {
                    const newAttendance = {}
                    students.forEach(student => {
                      newAttendance[student.studentId] = 'Absent'
                    })
                    setAttendance(newAttendance)
                  }}
                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {students.map((student, index) => (
                <motion.div
                  key={student.studentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Roll: {student.rollNo}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {['Present', 'Absent', 'Late'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleAttendanceChange(student.studentId, status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          attendance[student.studentId] === status
                            ? getStatusColor(status) + ' border-2'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || !selectedBatch || !selectedSubject}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Attendance...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      ) : selectedBatch ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No students are enrolled in the selected batch.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Select a batch to begin</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a batch, subject, and date to mark attendance.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceManager