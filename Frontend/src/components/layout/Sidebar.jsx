import { memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'

import { cn } from '@utils/cn'
import { useUIStore } from '@/store/uiStore'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { ROUTES } from '@utils/constants'

import {
  LayoutDashboard,
  BarChart3,
  Users,
  CheckSquare,
  UserCog,
  ChevronLeft,
  Zap,
  CalendarClock,
  BookOpen,
  FileQuestion,
  GraduationCap,
  School,
  ScrollText,
  Book,
  UserSquare,
  ClipboardList,
  Layers,
  ClipboardCheck
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard, permission: null },
  { name: 'Users', href: ROUTES.USERS, icon: Users, permission: PERMISSIONS.VIEW_USERS },
  { name: 'Courses', href: ROUTES.COURSES, icon: GraduationCap, permission: PERMISSIONS.VIEW_COURSES },
  { name: 'Subjects', href: ROUTES.SUBJECTS, icon: Book, permission: PERMISSIONS.VIEW_SUBJECTS },
  { name: 'Staffs', href: ROUTES.STAFFS, icon: UserCog, permission: PERMISSIONS.VIEW_STAFF },
  { name: 'Batch', href: ROUTES.BATCH, icon: Layers, permission: PERMISSIONS.VIEW_BATCHES },
  { name: 'Student', href: ROUTES.STUDENT, icon: UserSquare, permission: PERMISSIONS.VIEW_STUDENTS },
  // { name: 'Classes', href: ROUTES.CLASSES, icon: School, permission: PERMISSIONS.VIEW_CLASSES },
  { name: 'TimeTables', href: ROUTES.TIMETABLE, icon: CalendarClock, permission: PERMISSIONS.VIEW_TIMETABLE },
  { name: 'Attendance', href: ROUTES.ATTENDANCE, icon: ClipboardCheck, permission: PERMISSIONS.VIEW_ATTENDANCE },
  { name: 'StudyMaterials', href: ROUTES.STUDYMATERIAL, icon: BookOpen, permission: PERMISSIONS.VIEW_MATERIALS },
  { name: 'QuestionPapers', href: ROUTES.QUESTIONPAPER, icon: FileQuestion, permission: PERMISSIONS.VIEW_QUESTION_PAPERS },
  { name: 'Exams', href: ROUTES.EXAMS, icon: ClipboardList, permission: PERMISSIONS.VIEW_EXAMS },
  { name: 'My Exams', href: ROUTES.STUDENT_EXAMS, icon: ClipboardList, permission: PERMISSIONS.ATTEMPT_EXAM },
  { name: 'Results', href: ROUTES.RESULTS, icon: ScrollText, permission: PERMISSIONS.CREATE_RESULT },
  { name: 'My Results', href: ROUTES.STUDENT_RESULTS, icon: ScrollText, permission: PERMISSIONS.ATTEMPT_EXAM },
]

const Sidebar = memo(() => {
  const { sidebarCollapsed, toggleSidebar, sidebarMobile, setMobileSidebar } = useUIStore()
  const { can } = usePermissions()
  const location = useLocation()

  const filteredNavigation = useMemo(() => {
    return navigation.filter(item => !item.permission || can(item.permission))
  }, [can])

  const handleMobileClose = useCallback(() => setMobileSidebar(false), [setMobileSidebar])
  const handleToggleSidebar = useCallback(() => toggleSidebar(), [toggleSidebar])

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 }
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={handleMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl",
          "lg:relative lg:translate-x-0",
          sidebarMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg gradient-text">
                    Academy
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <item.icon className="w-5 h-5 flex-shrink-0" />

                        <AnimatePresence mode="wait">
                          {!sidebarCollapsed && (
                            <motion.span
                              variants={itemVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              transition={{ duration: 0.2 }}
                              className="font-medium"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-xs text-gray-500 dark:text-gray-400 text-center"
                >
                  Enterprise Dashboard v1.0
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
})

export default Sidebar