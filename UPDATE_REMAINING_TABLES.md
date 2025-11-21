# Update Remaining Tables - Copy-Paste Instructions

## ✅ Already Updated (8/12):
1. ✅ StudentTable
2. ✅ StaffTable
3. ✅ CourseTable
4. ✅ SubjectTable
5. ✅ BatchTable
6. ✅ ClassTable
7. ✅ UserTable
8. ✅ QuestionPaperTable

## 📋 Remaining Tables (4/12):

### 1. ExamTable.jsx
**File:** `Frontend/src/features/exam/components/ExamTable.jsx`

**Add imports:**
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

**Add after component declaration:**
```jsx
const { can } = usePermissions()
```

**Replace GenericDataTable props:**
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_EXAM)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_EXAM)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_EXAM) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_EXAM) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_EXAM) ? handleDelete : undefined}
  onBulkDelete={can(PERMISSIONS.DELETE_EXAM) ? handleBulkDelete : undefined}
  actions={allowedActions}
  // ... keep other props
/>
```

---

### 2. StudyMaterialTable.jsx
**File:** `Frontend/src/features/studymaterials/components/StudyMaterialTable.jsx`

**Add imports:**
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

**Add after component declaration:**
```jsx
const { can } = usePermissions()
```

**Replace GenericDataTable props:**
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_MATERIAL)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_MATERIAL)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.UPLOAD_MATERIAL) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_MATERIAL) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_MATERIAL) ? handleDelete : undefined}
  onBulkDelete={can(PERMISSIONS.DELETE_MATERIAL) ? handleBulkDelete : undefined}
  actions={allowedActions}
  // ... keep other props
/>
```

---

### 3. AttendanceTable.jsx
**File:** `Frontend/src/features/attendance/components/AttendanceTable.jsx`

**Add imports:**
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

**Add after component declaration:**
```jsx
const { can } = usePermissions()
```

**Replace GenericDataTable props:**
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_ATTENDANCE)) allowedActions.push('edit')

<GenericDataTable
  onAdd={can(PERMISSIONS.MARK_ATTENDANCE) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_ATTENDANCE) ? handleEdit : undefined}
  actions={allowedActions}
  // ... keep other props
/>
```

---

### 4. ResultTable.jsx
**File:** `Frontend/src/features/results/components/ResultTable.jsx`

**Add imports:**
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

**Add after component declaration:**
```jsx
const { can } = usePermissions()
```

**Replace GenericDataTable props:**
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_RESULT)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_RESULT)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_RESULT) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_RESULT) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_RESULT) ? handleDelete : undefined}
  onBulkDelete={can(PERMISSIONS.DELETE_RESULT) ? handleBulkDelete : undefined}
  actions={allowedActions}
  // ... keep other props
/>
```

---

### 5. TimeTable.jsx
**File:** `Frontend/src/features/timeTables/components/TimeTable.jsx`

**Add imports:**
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

**Add after component declaration:**
```jsx
const { can } = usePermissions()
```

**Replace GenericDataTable props:**
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_TIMETABLE)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_TIMETABLE)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_TIMETABLE) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_TIMETABLE) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_TIMETABLE) ? handleDelete : undefined}
  actions={allowedActions}
  // ... keep other props
/>
```

---

## ✅ Final Result

After updating all tables:
- **Admin**: Sees all Add/Edit/Delete buttons
- **Staff**: Sees buttons based on their specific permissions
- **Student**: Sees NO action buttons (view only)

All buttons will automatically show/hide based on user role!
