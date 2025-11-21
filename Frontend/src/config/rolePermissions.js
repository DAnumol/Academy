// Role-based permissions configuration
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student'
}

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',

  // Student Management
  VIEW_STUDENTS: 'view_students',
  CREATE_STUDENT: 'create_student',
  EDIT_STUDENT: 'edit_student',
  DELETE_STUDENT: 'delete_student',

  // Staff Management
  VIEW_STAFF: 'view_staff',
  CREATE_STAFF: 'create_staff',
  EDIT_STAFF: 'edit_staff',
  DELETE_STAFF: 'delete_staff',

  // Course Management
  VIEW_COURSES: 'view_courses',
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',

  // Subject Management
  VIEW_SUBJECTS: 'view_subjects',
  CREATE_SUBJECT: 'create_subject',
  EDIT_SUBJECT: 'edit_subject',
  DELETE_SUBJECT: 'delete_subject',

  // Batch Management
  VIEW_BATCHES: 'view_batches',
  CREATE_BATCH: 'create_batch',
  EDIT_BATCH: 'edit_batch',
  DELETE_BATCH: 'delete_batch',

  // Class Management
  VIEW_CLASSES: 'view_classes',
  CREATE_CLASS: 'create_class',
  EDIT_CLASS: 'edit_class',
  DELETE_CLASS: 'delete_class',

  // Timetable Management
  VIEW_TIMETABLE: 'view_timetable',
  CREATE_TIMETABLE: 'create_timetable',
  EDIT_TIMETABLE: 'edit_timetable',
  DELETE_TIMETABLE: 'delete_timetable',

  // Question Paper Management
  VIEW_QUESTION_PAPERS: 'view_question_papers',
  CREATE_QUESTION_PAPER: 'create_question_paper',
  EDIT_QUESTION_PAPER: 'edit_question_paper',
  DELETE_QUESTION_PAPER: 'delete_question_paper',
  ATTEMPT_EXAM: 'attempt_exam',

  // Exam Management
  VIEW_EXAMS: 'view_exams',
  CREATE_EXAM: 'create_exam',
  EDIT_EXAM: 'edit_exam',
  DELETE_EXAM: 'delete_exam',

  // Study Material Management
  VIEW_MATERIALS: 'view_materials',
  UPLOAD_MATERIAL: 'upload_material',
  EDIT_MATERIAL: 'edit_material',
  DELETE_MATERIAL: 'delete_material',

  // Attendance Management
  VIEW_ATTENDANCE: 'view_attendance',
  MARK_ATTENDANCE: 'mark_attendance',
  EDIT_ATTENDANCE: 'edit_attendance',

  // Result Management
  VIEW_RESULTS: 'view_results',
  CREATE_RESULT: 'create_result',
  EDIT_RESULT: 'edit_result',
  DELETE_RESULT: 'delete_result',

  // Notification Management
  VIEW_NOTIFICATIONS: 'view_notifications',
  CREATE_NOTIFICATION: 'create_notification',
  DELETE_NOTIFICATION: 'delete_notification',

  // Dashboard Access
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  VIEW_STAFF_DASHBOARD: 'view_staff_dashboard',
  VIEW_STUDENT_DASHBOARD: 'view_student_dashboard'
}

// Role-based permission mapping
export const rolePermissions = {
  [ROLES.ADMIN]: [
    // Full access to everything
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.CREATE_STUDENT,
    PERMISSIONS.EDIT_STUDENT,
    PERMISSIONS.DELETE_STUDENT,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.CREATE_STAFF,
    PERMISSIONS.EDIT_STAFF,
    PERMISSIONS.DELETE_STAFF,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.DELETE_COURSE,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.CREATE_SUBJECT,
    PERMISSIONS.EDIT_SUBJECT,
    PERMISSIONS.DELETE_SUBJECT,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.CREATE_BATCH,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.DELETE_BATCH,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.CREATE_CLASS,
    PERMISSIONS.EDIT_CLASS,
    PERMISSIONS.DELETE_CLASS,
    PERMISSIONS.VIEW_TIMETABLE,
    PERMISSIONS.CREATE_TIMETABLE,
    PERMISSIONS.EDIT_TIMETABLE,
    PERMISSIONS.DELETE_TIMETABLE,
    PERMISSIONS.VIEW_QUESTION_PAPERS,
    PERMISSIONS.CREATE_QUESTION_PAPER,
    PERMISSIONS.EDIT_QUESTION_PAPER,
    PERMISSIONS.DELETE_QUESTION_PAPER,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.CREATE_EXAM,
    PERMISSIONS.EDIT_EXAM,
    PERMISSIONS.DELETE_EXAM,
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.UPLOAD_MATERIAL,
    PERMISSIONS.EDIT_MATERIAL,
    PERMISSIONS.DELETE_MATERIAL,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MARK_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.CREATE_RESULT,
    PERMISSIONS.EDIT_RESULT,
    PERMISSIONS.DELETE_RESULT,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.CREATE_NOTIFICATION,
    PERMISSIONS.DELETE_NOTIFICATION,
    PERMISSIONS.VIEW_ADMIN_DASHBOARD
  ],

  [ROLES.STAFF]: [
    // View students, staff, courses, subjects
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.VIEW_CLASSES,
    
    // View timetable
    PERMISSIONS.VIEW_TIMETABLE,
    
    // Manage question papers
    PERMISSIONS.VIEW_QUESTION_PAPERS,
    PERMISSIONS.CREATE_QUESTION_PAPER,
    PERMISSIONS.EDIT_QUESTION_PAPER,
    PERMISSIONS.DELETE_QUESTION_PAPER,
    
    // Manage exams
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.CREATE_EXAM,
    PERMISSIONS.EDIT_EXAM,
    
    // Manage study materials
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.UPLOAD_MATERIAL,
    PERMISSIONS.EDIT_MATERIAL,
    PERMISSIONS.DELETE_MATERIAL,
    
    // Manage attendance
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MARK_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    
    // Manage results
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.CREATE_RESULT,
    PERMISSIONS.EDIT_RESULT,
    
    // Notifications
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.CREATE_NOTIFICATION,
    
    PERMISSIONS.VIEW_STAFF_DASHBOARD
  ],

  [ROLES.STUDENT]: [
    // View only access
    PERMISSIONS.VIEW_TIMETABLE,
    PERMISSIONS.ATTEMPT_EXAM,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.VIEW_STUDENT_DASHBOARD
  ]
}

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  const permissions = rolePermissions[userRole] || []
  return permissions.includes(permission)
}

// Check if user has any of the permissions
export const hasAnyPermission = (userRole, permissionList) => {
  if (!userRole || !permissionList || !Array.isArray(permissionList)) return false
  return permissionList.some(permission => hasPermission(userRole, permission))
}

// Check if user has all permissions
export const hasAllPermissions = (userRole, permissionList) => {
  if (!userRole || !permissionList || !Array.isArray(permissionList)) return false
  return permissionList.every(permission => hasPermission(userRole, permission))
}

// Get all permissions for a role
export const getRolePermissions = (userRole) => {
  return rolePermissions[userRole] || []
}
