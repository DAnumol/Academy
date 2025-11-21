import React, { Suspense, lazy, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardLayout from '@components/layout/DashboardLayout'
import PageTransition from '@components/animations/PageTransition'
import withAuth from '@components/hoc/withAuth'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import { useTheme } from '@hooks/useTheme'
import { ROUTES } from '@utils/constants'
import { PERMISSIONS } from '@/config/rolePermissions'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'))
const AnalyticsPage = lazy(() => import('@features/analytics/pages/AnalyticsPage'))
const UsersPage = lazy(() => import('@features/users/pages/UsersPage'))
const TasksPage = lazy(() => import('@features/tasks/pages/TasksPage'))
const SettingsPage = lazy(() => import('@features/settings/pages/SettingsPage'))
const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'))
const RoleManagementPage = lazy(() => import('./pages/users/RoleManagement'))
const PreferencesPage = lazy(() => import('./pages/settings/Preferences'))
const UpgradePage = lazy(() => import('./pages/settings/UpgradePlan'))

const StaffPage = lazy(() => import('@features/staffs/pages/StaffPage'))
const TimeTablePage = lazy(() => import('@features/timeTables/pages/TimeTablePage'))
const StudyMaterialePage = lazy(() => import('@features/studymaterials/pages/StudyMaterialPage'))
const QuestionPaperPage = lazy(() => import('@features/questionpapers/pages/QuestionPaperPage'))
const SubjectPage = lazy(() => import('@features/subjects/pages/SubjectPage'))
const CoursePage = lazy(() => import('@features/course/pages/CoursePage'))
// const ClassPage = lazy(() => import('@features/class/pages/ClassPage'))
const ExamPage = lazy(() => import('@features/exam/pages/ExamPage'))
const ResultPage = lazy(() => import('@features/results/pages/ResultPage'))
const StudentsPage = lazy(() => import('@features/student/pages/StudentsPage'))
const BatchPage = lazy(() => import('@features/batch/pages/BatchPage'))
const AttendancePage = lazy(() => import('@features/attendance/pages/AttendancePage'))
const StudentExamPage = lazy(() => import('@features/exam/pages/StudentExamPage'))
const StudentResultPage = lazy(() => import('@features/results/pages/StudentResultPage'))
const AdminRegisterPage = lazy(() => import('@features/auth/pages/AdminRegisterPage'))
const UnauthorizedPage = lazy(() => import('@/pages/Unauthorized'))

import LoadingSpinner from '@components/common/LoadingSpinner'




// Protected components
const ProtectedDashboardLayout = withAuth(DashboardLayout)

function App() {
  const { isDark } = useTheme()
  
  const handleGoBack = useCallback(() => {
    window.history.back()
  }, [])
  


  return (
    <div className={isDark ? 'dark' : ''}>
      <Suspense fallback={<LoadingSpinner fullScreen text="Loading Application..." />}>
        <Routes>
          {/* Public routes */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            }
          />
          <Route
            path={ROUTES.ADMIN_REGISTER}
            element={
              <PageTransition>
                <AdminRegisterPage />
              </PageTransition>
            }
          />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedDashboardLayout />}>
            <Route
              index
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.ANALYTICS}
              element={
                <PageTransition>
                  <AnalyticsPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
                  <PageTransition>
                    <UsersPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.STUDENT}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
                  <PageTransition>
                    <StudentsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BATCH}
              element={
                <PageTransition>
                  <BatchPage/>
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.ATTENDANCE}
              element={
                <PageTransition>
                  <AttendancePage/>
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.STAFFS}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STAFF}>
                  <PageTransition>
                    <StaffPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SUBJECTS}
              element={
                <PageTransition>
                  <SubjectPage />
                </PageTransition>
              }
            />
             <Route
              path={ROUTES.COURSES}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_COURSES}>
                  <PageTransition>
                    <CoursePage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            {/* <Route
              path={ROUTES.CLASSES}
              element={
                <PageTransition>
                  <ClassPage />
                </PageTransition>
              }
            /> */}
             <Route
              path={ROUTES.EXAMS}
              element={
                <PageTransition>
                  <ExamPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.STUDENT_EXAMS}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.ATTEMPT_EXAM}>
                  <PageTransition>
                    <StudentExamPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.STUDENT_RESULTS}
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_RESULTS}>
                  <PageTransition>
                    <StudentResultPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
             <Route
              path={ROUTES.RESULTS}
              element={
                <PageTransition>
                  <ResultPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.TIMETABLE}
              element={
                <PageTransition>
                  <TimeTablePage />
                </PageTransition>
              }
            />
            
            <Route
              path={ROUTES.STUDYMATERIAL}
              element={
                <PageTransition>
                  <StudyMaterialePage />
                </PageTransition>
              }
            />
            
              <Route
              path={ROUTES.QUESTIONPAPER}
              element={
                <PageTransition>
                  <QuestionPaperPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.TASKS}
              element={
                <PageTransition>
                  <TasksPage />
                </PageTransition>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransition>
                  <SettingsPage />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />

            <Route
              path={ROUTES.ROLE_MANAGEMENT}
              element={
                <PageTransition>
                  <RoleManagementPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.PREFERENCES}
              element={
                <PageTransition>
                  <PreferencesPage />
                </PageTransition>
              }
            />
            <Route
              path={ROUTES.UPGRADE}
              element={
                <PageTransition>
                  <UpgradePage />
                </PageTransition>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <PageTransition>
                  <UnauthorizedPage />
                </PageTransition>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    Page not found
                  </p>
                  <motion.button
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoBack}
                  >
                    Go Back
                  </motion.button>
                </motion.div>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App