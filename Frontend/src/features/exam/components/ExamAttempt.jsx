import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, Shield, ZoomIn, X } from 'lucide-react'
import { examService } from '@/services/examService'
import { showToast } from '@/utils/toast'
import { NEET_CONFIG } from '@/config/neetConfig'

const ExamAttempt = ({ exam, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(exam.questionPaper.duration * 60)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [violations, setViolations] = useState([])
  const [examEnded, setExamEnded] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const timerRef = useRef(null)
  const answersRef = useRef({})
  const submittedRef = useRef(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examEnded) {
        const violation = {
          type: 'TAB_SWITCH',
          timestamp: new Date().toISOString(),
          message: 'Student switched tabs'
        }
        setViolations(prev => [...prev, violation])
        showToast.warning('Tab switch detected! Violation recorded.')
      }
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    const handleKeyDown = (e) => {
      if (!examEnded && ((e.ctrlKey && (e.key === 'w' || e.key === 't')) || e.key === 'F5' || (e.ctrlKey && e.key === 'r') || e.key === 'Escape')) {
        e.preventDefault()
        const violation = {
          type: 'BLOCKED_ACTION',
          timestamp: new Date().toISOString(),
          message: `Attempted: ${e.key}`
        }
        setViolations(prev => [...prev, violation])
        showToast.error('Action blocked during exam')
      }
    }

    const handleContextMenu = (e) => {
      e.preventDefault()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen()
      } catch (err) {
        console.error('Fullscreen error:', err)
      }
    }
    
    enterFullscreen()
    
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !examEnded) {
        const violation = {
          type: 'FULLSCREEN_EXIT',
          timestamp: new Date().toISOString(),
          message: 'Student exited fullscreen'
        }
        setViolations(prev => [...prev, violation])
        showToast.error('Fullscreen exit detected! Re-entering...')
        enterFullscreen()
      }
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [examEnded])

  const handleAutoSubmit = async () => {
    if (submittedRef.current) return
    submittedRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    setExamEnded(true)
    await submitExam()
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  const submitExam = async () => {
    if (submittedRef.current && submitting) return
    try {
      setSubmitting(true)
      await examService.submit(exam.examId, answersRef.current, violations)
      showToast.success('Exam submitted successfully')
      onComplete()
    } catch (error) {
      showToast.error('Failed to submit exam')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = () => {
    setShowConfirm(true)
  }

  const confirmSubmit = () => {
    if (submittedRef.current) return
    submittedRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    setExamEnded(true)
    submitExam()
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer }
      answersRef.current = updated
      return updated
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const questions = exam.questionPaper?.questionSet || []
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {violations.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span>Violations: {violations.length}</span>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {exam.questionPaper.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {answeredCount} of {questions.length} answered
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                +{NEET_CONFIG.MARKS_PER_CORRECT} for correct | {NEET_CONFIG.MARKS_PER_INCORRECT} for incorrect | 0 for unattempted
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-blue-600'}`}>
                <Clock className="h-6 w-6" />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {question.question}
                  </h3>
                  {question.imageUrl && (
                    <div className="mb-4 relative inline-block">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${question.imageUrl}`} 
                        alt="Question" 
                        className="max-w-xs h-32 object-contain rounded-lg border shadow-sm"
                      />
                      <button
                        onClick={() => setFullscreenImage(`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${question.imageUrl}`)}
                        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Marks: {question.marks}
                  </div>

                  {question.type === 'mcq' && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            answers[question.id] === option
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="mr-3"
                          />
                          <span className="text-gray-900 dark:text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'text' && (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="4"
                      placeholder="Type your answer here..."
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setFullscreenImage(null)}>
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Fullscreen" 
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Submission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to submit? You have answered {answeredCount} out of {questions.length} questions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ExamAttempt
