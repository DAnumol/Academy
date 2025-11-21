import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Calendar, FileText, Award } from 'lucide-react'
import { resultService } from '@/services/resultService'
import { showToast } from '@/utils/toast'

const StudentResultPage = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, average: 0, highest: 0 })

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await resultService.getStudentResults()
      const data = response.data || response
      setResults(data)
      
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / data.length
        const highest = Math.max(...data.map(r => parseFloat(r.percentage)))
        setStats({ total: data.length, average: avg.toFixed(2), highest: highest.toFixed(2) })
      }
    } catch (error) {
      showToast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-500 bg-green-50',
      'B': 'text-blue-600 bg-blue-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    }
    return colors[grade] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Results</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Exams</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average Score</p>
              <p className="text-3xl font-bold mt-1">{stats.average}%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Highest Score</p>
              <p className="text-3xl font-bold mt-1">{stats.highest}%</p>
            </div>
            <Trophy className="h-12 w-12 text-yellow-200" />
          </div>
        </motion.div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">No results available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.resultId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {result.exam?.questionPaper?.title || 'Exam'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marks</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.obtainedMarks}/{result.totalMarks}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.percentage}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </div>
                </div>
              </div>

              {result.remarks && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Remarks:</span> {result.remarks}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentResultPage
