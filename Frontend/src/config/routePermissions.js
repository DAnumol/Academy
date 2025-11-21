import { PERMISSIONS, ROLES } from './rolePermissions'

// Route access configuration
export const routePermissions = {
  // Dashboard routes
  '/dashboard': {
    [ROLES.ADMIN]: PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    [ROLES.STAFF]: PERMISSIONS.VIEW_STAFF_DASHBOARD,
    [ROLES.STUDENT]: PERMISSIONS.VIEW_STUDENT_DASHBOARD
  },

  // User Management
  '/users': PERMISSIONS.VIEW_USERS,

  // Student Management
  '/students': PERMISSIONS.VIEW_STUDENTS,

  // Staff Management
  '/staff': PERMISSIONS.VIEW_STAFF,

  // Course Management
  '/courses': PERMISSIONS.VIEW_COURSES,

  // Subject Management
  '/subjects': PERMISSIONS.VIEW_SUBJECTS,

  // Batch Management
  '/batches': PERMISSIONS.VIEW_BATCHES,

  // Class Management
  '/classes': PERMISSIONS.VIEW_CLASSES,

  // Timetable
  '/timetables': PERMISSIONS.VIEW_TIMETABLE,

  // Question Papers
  '/questionpapers': PERMISSIONS.VIEW_QUESTION_PAPERS,

  // Exams
  '/exams': PERMISSIONS.VIEW_EXAMS,

  // Study Materials
  '/materials': PERMISSIONS.VIEW_MATERIALS,

  // Attendance
  '/attendance': PERMISSIONS.VIEW_ATTENDANCE,

  // Results
  '/results': PERMISSIONS.VIEW_RESULTS,

  // Notifications
  '/notifications': PERMISSIONS.VIEW_NOTIFICATIONS
}

// Page action permissions (for buttons, forms, etc.)
export const pageActions = {
  users: {
    create: PERMISSIONS.CREATE_USER,
    edit: PERMISSIONS.EDIT_USER,
    delete: PERMISSIONS.DELETE_USER
  },
  students: {
    create: PERMISSIONS.CREATE_STUDENT,
    edit: PERMISSIONS.EDIT_STUDENT,
    delete: PERMISSIONS.DELETE_STUDENT
  },
  staff: {
    create: PERMISSIONS.CREATE_STAFF,
    edit: PERMISSIONS.EDIT_STAFF,
    delete: PERMISSIONS.DELETE_STAFF
  },
  courses: {
    create: PERMISSIONS.CREATE_COURSE,
    edit: PERMISSIONS.EDIT_COURSE,
    delete: PERMISSIONS.DELETE_COURSE
  },
  subjects: {
    create: PERMISSIONS.CREATE_SUBJECT,
    edit: PERMISSIONS.EDIT_SUBJECT,
    delete: PERMISSIONS.DELETE_SUBJECT
  },
  batches: {
    create: PERMISSIONS.CREATE_BATCH,
    edit: PERMISSIONS.EDIT_BATCH,
    delete: PERMISSIONS.DELETE_BATCH
  },
  classes: {
    create: PERMISSIONS.CREATE_CLASS,
    edit: PERMISSIONS.EDIT_CLASS,
    delete: PERMISSIONS.DELETE_CLASS
  },
  timetables: {
    create: PERMISSIONS.CREATE_TIMETABLE,
    edit: PERMISSIONS.EDIT_TIMETABLE,
    delete: PERMISSIONS.DELETE_TIMETABLE
  },
  questionpapers: {
    create: PERMISSIONS.CREATE_QUESTION_PAPER,
    edit: PERMISSIONS.EDIT_QUESTION_PAPER,
    delete: PERMISSIONS.DELETE_QUESTION_PAPER,
    attempt: PERMISSIONS.ATTEMPT_EXAM
  },
  exams: {
    create: PERMISSIONS.CREATE_EXAM,
    edit: PERMISSIONS.EDIT_EXAM,
    delete: PERMISSIONS.DELETE_EXAM
  },
  materials: {
    upload: PERMISSIONS.UPLOAD_MATERIAL,
    edit: PERMISSIONS.EDIT_MATERIAL,
    delete: PERMISSIONS.DELETE_MATERIAL
  },
  attendance: {
    mark: PERMISSIONS.MARK_ATTENDANCE,
    edit: PERMISSIONS.EDIT_ATTENDANCE
  },
  results: {
    create: PERMISSIONS.CREATE_RESULT,
    edit: PERMISSIONS.EDIT_RESULT,
    delete: PERMISSIONS.DELETE_RESULT
  },
  notifications: {
    create: PERMISSIONS.CREATE_NOTIFICATION,
    delete: PERMISSIONS.DELETE_NOTIFICATION
  }
}
