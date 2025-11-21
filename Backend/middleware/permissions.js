const PERMISSIONS = {
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_STUDENTS: 'view_students',
  CREATE_STUDENT: 'create_student',
  EDIT_STUDENT: 'edit_student',
  DELETE_STUDENT: 'delete_student',
  VIEW_STAFF: 'view_staff',
  CREATE_STAFF: 'create_staff',
  EDIT_STAFF: 'edit_staff',
  DELETE_STAFF: 'delete_staff',
  VIEW_COURSES: 'view_courses',
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',
  VIEW_SUBJECTS: 'view_subjects',
  CREATE_SUBJECT: 'create_subject',
  EDIT_SUBJECT: 'edit_subject',
  DELETE_SUBJECT: 'delete_subject',
  VIEW_BATCHES: 'view_batches',
  CREATE_BATCH: 'create_batch',
  EDIT_BATCH: 'edit_batch',
  DELETE_BATCH: 'delete_batch',
  VIEW_CLASSES: 'view_classes',
  CREATE_CLASS: 'create_class',
  EDIT_CLASS: 'edit_class',
  DELETE_CLASS: 'delete_class',
  VIEW_TIMETABLE: 'view_timetable',
  CREATE_TIMETABLE: 'create_timetable',
  EDIT_TIMETABLE: 'edit_timetable',
  DELETE_TIMETABLE: 'delete_timetable',
  VIEW_QUESTION_PAPERS: 'view_question_papers',
  CREATE_QUESTION_PAPER: 'create_question_paper',
  EDIT_QUESTION_PAPER: 'edit_question_paper',
  DELETE_QUESTION_PAPER: 'delete_question_paper',
  ATTEMPT_EXAM: 'attempt_exam',
  VIEW_EXAMS: 'view_exams',
  CREATE_EXAM: 'create_exam',
  EDIT_EXAM: 'edit_exam',
  DELETE_EXAM: 'delete_exam',
  VIEW_MATERIALS: 'view_materials',
  UPLOAD_MATERIAL: 'upload_material',
  EDIT_MATERIAL: 'edit_material',
  DELETE_MATERIAL: 'delete_material',
  VIEW_ATTENDANCE: 'view_attendance',
  MARK_ATTENDANCE: 'mark_attendance',
  EDIT_ATTENDANCE: 'edit_attendance',
  VIEW_RESULTS: 'view_results',
  CREATE_RESULT: 'create_result',
  EDIT_RESULT: 'edit_result',
  DELETE_RESULT: 'delete_result',
  VIEW_NOTIFICATIONS: 'view_notifications',
  CREATE_NOTIFICATION: 'create_notification',
  DELETE_NOTIFICATION: 'delete_notification'
}

const rolePermissions = {
  admin: Object.values(PERMISSIONS),
  staff: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.VIEW_TIMETABLE,
    PERMISSIONS.VIEW_QUESTION_PAPERS,
    PERMISSIONS.CREATE_QUESTION_PAPER,
    PERMISSIONS.EDIT_QUESTION_PAPER,
    PERMISSIONS.DELETE_QUESTION_PAPER,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.CREATE_EXAM,
    PERMISSIONS.EDIT_EXAM,
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
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.CREATE_NOTIFICATION
  ],
  student: [
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_TIMETABLE,
    PERMISSIONS.VIEW_QUESTION_PAPERS,
    PERMISSIONS.ATTEMPT_EXAM,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_NOTIFICATIONS
  ]
}

const hasPermission = (role, permission) => {
  const permissions = rolePermissions[role] || []
  return permissions.includes(permission)
}

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!hasPermission(userRole, requiredPermission)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}

module.exports = { PERMISSIONS, checkPermission, hasPermission }
