export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  TASKS: '/tasks',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PREFERENCES: '/preferences',
  ROLE_MANAGEMENT: '/role-management',
  UPGRADE: '/upgrade',
  STAFFS: '/staffs',
  TIMETABLE: '/timetables',
  STUDYMATERIAL: '/studymaterial',
  QUESTIONPAPER:'/questionpaper',
   SUBJECTS:'/Subjects',
  COURSES:'/Courses',
  CLASSES:'/Classes',
  EXAMS:'/Exams',
  RESULTS:'/Results',
   STUDENT:'/student',
  BATCH:'/batch',
  ATTENDANCE:'/attendance',
  STUDENT_EXAMS: '/student-exams',
  STUDENT_RESULTS: '/student-results',
  ADMIN_REGISTER: '/admin-register',
  COMMON_ATTENDANCE:'/common-atendance',
  PAYMENT:'/payment'
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN_KEY || 'enterprise_auth_token',
  USER_DATA: import.meta.env.VITE_USER_DATA_KEY || 'enterprise_user_data',
  THEME: import.meta.env.VITE_THEME_KEY || 'enterprise_theme_preference',
  SIDEBAR_STATE: import.meta.env.VITE_SIDEBAR_KEY || 'enterprise_sidebar_collapsed'
}

export const PERMISSIONS = {
  READ_USERS: 'read:users',
  WRITE_USERS: 'write:users',
  DELETE_USERS: 'delete:users',
  READ_ANALYTICS: 'read:analytics',
  WRITE_ANALYTICS: 'write:analytics',
  ADMIN_ACCESS: 'admin:access',
  SUPER_ADMIN: 'super:admin'
}

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  VIEWER: 'viewer',
  EDITOR: 'editor'
}

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
  HIGH_CONTRAST: 'high-contrast'
}

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
}

export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#d946ef',
  accent: '#f97316',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}