# Role-Based Access Control (RBAC) Guide

## Overview
This document outlines the role-based permissions system for the NEET Academy platform.

## Roles

### 1. Admin
**Full System Access**
- Create, edit, delete all entities
- Manage users, staff, students
- Configure courses, subjects, batches, classes
- Create and manage timetables
- View all reports and analytics
- Manage question papers and exams
- Upload and manage study materials
- View and manage attendance
- Create and publish results
- Send notifications

### 2. Staff
**Teaching & Management Access**
- **View Only**: Students, Staff, Courses, Subjects, Batches, Classes, Timetables
- **Full Access**: Question Papers, Exams, Study Materials, Attendance, Results
- **Create**: Notifications for students
- **Cannot**: Create/Edit/Delete Users, Students, Staff, Courses, Subjects, Batches, Classes, Timetables

### 3. Student
**View & Attempt Access**
- **View Only**: Courses, Subjects, Timetables, Question Papers, Exams, Study Materials, Attendance, Results, Notifications
- **Can**: Attempt exams
- **Cannot**: Create, Edit, or Delete anything

---

## Permission Matrix

| Feature | Admin | Staff | Student |
|---------|-------|-------|---------|
| **Users** |
| View Users | ✅ | ❌ | ❌ |
| Create User | ✅ | ❌ | ❌ |
| Edit User | ✅ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ |
| **Students** |
| View Students | ✅ | ✅ | ❌ |
| Create Student | ✅ | ❌ | ❌ |
| Edit Student | ✅ | ❌ | ❌ |
| Delete Student | ✅ | ❌ | ❌ |
| **Staff** |
| View Staff | ✅ | ✅ | ❌ |
| Create Staff | ✅ | ❌ | ❌ |
| Edit Staff | ✅ | ❌ | ❌ |
| Delete Staff | ✅ | ❌ | ❌ |
| **Courses** |
| View Courses | ✅ | ✅ | ✅ |
| Create Course | ✅ | ❌ | ❌ |
| Edit Course | ✅ | ❌ | ❌ |
| Delete Course | ✅ | ❌ | ❌ |
| **Subjects** |
| View Subjects | ✅ | ✅ | ✅ |
| Create Subject | ✅ | ❌ | ❌ |
| Edit Subject | ✅ | ❌ | ❌ |
| Delete Subject | ✅ | ❌ | ❌ |
| **Batches** |
| View Batches | ✅ | ✅ | ❌ |
| Create Batch | ✅ | ❌ | ❌ |
| Edit Batch | ✅ | ❌ | ❌ |
| Delete Batch | ✅ | ❌ | ❌ |
| **Classes** |
| View Classes | ✅ | ✅ | ❌ |
| Create Class | ✅ | ❌ | ❌ |
| Edit Class | ✅ | ❌ | ❌ |
| Delete Class | ✅ | ❌ | ❌ |
| **Timetables** |
| View Timetable | ✅ | ✅ | ✅ |
| Create Timetable | ✅ | ❌ | ❌ |
| Edit Timetable | ✅ | ❌ | ❌ |
| Delete Timetable | ✅ | ❌ | ❌ |
| **Question Papers** |
| View Question Papers | ✅ | ✅ | ✅ |
| Create Question Paper | ✅ | ✅ | ❌ |
| Edit Question Paper | ✅ | ✅ | ❌ |
| Delete Question Paper | ✅ | ✅ | ❌ |
| Attempt Exam | ❌ | ❌ | ✅ |
| **Exams** |
| View Exams | ✅ | ✅ | ✅ |
| Create Exam | ✅ | ✅ | ❌ |
| Edit Exam | ✅ | ✅ | ❌ |
| Delete Exam | ✅ | ❌ | ❌ |
| **Study Materials** |
| View Materials | ✅ | ✅ | ✅ |
| Upload Material | ✅ | ✅ | ❌ |
| Edit Material | ✅ | ✅ | ❌ |
| Delete Material | ✅ | ✅ | ❌ |
| **Attendance** |
| View Attendance | ✅ | ✅ | ✅ |
| Mark Attendance | ✅ | ✅ | ❌ |
| Edit Attendance | ✅ | ✅ | ❌ |
| **Results** |
| View Results | ✅ | ✅ | ✅ |
| Create Result | ✅ | ✅ | ❌ |
| Edit Result | ✅ | ✅ | ❌ |
| Delete Result | ✅ | ❌ | ❌ |
| **Notifications** |
| View Notifications | ✅ | ✅ | ✅ |
| Create Notification | ✅ | ✅ | ❌ |
| Delete Notification | ✅ | ❌ | ❌ |

---

## Implementation Guide

### Frontend Usage

#### 1. Protect Routes
```jsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { PERMISSIONS } from '@/config/rolePermissions'

<Route path="/students" element={
  <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
    <StudentsPage />
  </ProtectedRoute>
} />
```

#### 2. Hide UI Elements
```jsx
import PermissionGuard from '@/components/auth/PermissionGuard'
import { PERMISSIONS } from '@/config/rolePermissions'

<PermissionGuard permission={PERMISSIONS.CREATE_STUDENT}>
  <Button onClick={handleAdd}>Add Student</Button>
</PermissionGuard>
```

#### 3. Use Permission Hook
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'

const MyComponent = () => {
  const { can } = usePermissions()

  return (
    <>
      {can(PERMISSIONS.EDIT_STUDENT) && (
        <Button onClick={handleEdit}>Edit</Button>
      )}
    </>
  )
}
```

### Backend Usage

#### Protect API Routes
```javascript
const { checkPermission, PERMISSIONS } = require('../middleware/permissions')

// Only admin can create students
router.post('/', 
  authenticate, 
  checkPermission(PERMISSIONS.CREATE_STUDENT), 
  createStudent
)

// Staff and admin can view students
router.get('/', 
  authenticate, 
  checkPermission(PERMISSIONS.VIEW_STUDENTS), 
  getAllStudents
)
```

---

## Page Access Summary

### Admin Pages
- Dashboard
- Users Management
- Students Management
- Staff Management
- Courses Management
- Subjects Management
- Batches Management
- Classes Management
- Timetables Management
- Question Papers Management
- Exams Management
- Study Materials Management
- Attendance Management
- Results Management
- Notifications Management
- Profile

### Staff Pages
- Dashboard
- Students (View Only)
- Staff (View Only)
- Courses (View Only)
- Subjects (View Only)
- Batches (View Only)
- Classes (View Only)
- Timetables (View Only)
- Question Papers (Full Access)
- Exams (Create/Edit)
- Study Materials (Full Access)
- Attendance (Full Access)
- Results (Create/Edit)
- Notifications (Create)
- Profile

### Student Pages
- Dashboard
- Courses (View Only)
- Subjects (View Only)
- Timetables (View Only)
- Question Papers (View/Attempt)
- Exams (View/Attempt)
- Study Materials (View Only)
- Attendance (View Own)
- Results (View Own)
- Notifications (View Only)
- Profile

---

## Notes
- All permissions are enforced on both frontend and backend
- Unauthorized access attempts return 403 Forbidden
- Students can only view their own attendance and results
- Staff can only manage data for their assigned batches
- Admin has unrestricted access to all features
