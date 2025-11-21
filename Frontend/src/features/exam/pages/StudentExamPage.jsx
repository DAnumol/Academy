import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { examService } from '@/services/examService'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/utils/toast'
import ExamAttempt from '../components/ExamAttempt'

const StudentExamPage = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState(null)
  const [viewingAnswers, setViewingAnswers] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const response = await examService.getMyExams()
      setExams(response.data || response)
    } catch (error) {
      showToast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const handleStartExam = (exam) => {
    if (exam.attempted) {
      showToast.error('You have already attempted this exam')
      return
    }
    
    const examDate = new Date(exam.date)
    const today = new Date()
    examDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    if (today < examDate) {
      showToast.error('Exam is not available yet. Please wait until the exam date.')
      return
    }
    
    setSelectedExam(exam)
  }

  const handleExamComplete = () => {
    setSelectedExam(null)
    fetchExams()
  }

  const handleViewAnswers = (exam) => {
    setViewingAnswers(exam)
  }

  if (selectedExam) {
    return <ExamAttempt exam={selectedExam} onComplete={handleExamComplete} />
  }

  if (viewingAnswers) {
    const studentAnswers = viewingAnswers.studentAnswers || {}
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{viewingAnswers.questionPaper?.title} - Answer Key</h1>
          <button
            onClick={() => setViewingAnswers(null)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Back to Exams
          </button>
        </div>
        <div className="space-y-4">
          {viewingAnswers.questionPaper?.questionSet?.map((q, idx) => {
            const studentAnswer = studentAnswers[q.id]
            const isCorrect = studentAnswer === q.correctAnswer
            const notAttempted = !studentAnswer
            
            return (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isCorrect ? 'bg-green-600' : notAttempted ? 'bg-gray-400' : 'bg-red-600'
                  } text-white`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{q.question}</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Marks: {q.marks}</div>
                    
                    {notAttempted && (
                      <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">❌ Not Attempted</span>
                      </div>
                    )}
                    
                    {studentAnswer && !isCorrect && (
                      <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg">
                        <span className="text-red-600 font-semibold">✗ Your Answer: </span>
                        <span className="text-gray-900 dark:text-white">{studentAnswer}</span>
                      </div>
                    )}
                    
                    {q.type === 'mcq' && (
                      <div className="space-y-2">
                        {q.options?.map((option, optIdx) => {
                          const isStudentAnswer = option === studentAnswer
                          const isCorrectAnswer = option === q.correctAnswer
                          
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 border rounded-lg ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : isStudentAnswer
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              <span className="text-gray-900 dark:text-white">{option}</span>
                              {isCorrectAnswer && (
                                <span className="ml-2 text-green-600 font-semibold">✓ Correct Answer</span>
                              )}
                              {isStudentAnswer && !isCorrectAnswer && (
                                <span className="ml-2 text-red-600 font-semibold">✗ Your Wrong Answer</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Exams</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">No exams available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <motion.div
              key={exam.examId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {exam.questionPaper?.title}
                </h3>
                {exam.attempted ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{exam.questionPaper?.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{exam.questionPaper?.totalMarks} marks</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Date: {new Date(exam.date).toLocaleDateString()}
                </div>
                {!exam.attempted && (() => {
                  const examDate = new Date(exam.date)
                  const today = new Date()
                  examDate.setHours(0, 0, 0, 0)
                  today.setHours(0, 0, 0, 0)
                  return today < examDate ? (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Available on {new Date(exam.date).toLocaleDateString()}
                    </div>
                  ) : null
                })()}
              </div>

              {exam.attempted ? (
                <button
                  onClick={() => handleViewAnswers(exam)}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  View Answers
                </button>
              ) : (() => {
                const examDate = new Date(exam.date)
                const today = new Date()
                examDate.setHours(0, 0, 0, 0)
                today.setHours(0, 0, 0, 0)
                const isAvailable = today >= examDate
                
                return (
                  <button
                    onClick={() => handleStartExam(exam)}
                    disabled={!isAvailable}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      isAvailable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-gray-200'
                    }`}
                  >
                    {isAvailable ? 'Start Exam' : 'Not Available Yet'}
                  </button>
                )
              })()}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentExamPage
