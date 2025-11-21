# Quick Implementation Guide - Apply to All Components

## ✅ Already Implemented
- Sidebar - Shows/hides menu items based on permissions
- StudentTable - Shows/hides action buttons based on permissions
- 4 Backend routes - Using permission middleware

## 🔧 Apply This Pattern to All Table Components

### Step 1: Import Required Modules
```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
```

### Step 2: Use Permission Hook
```jsx
const MyTable = () => {
  const { can } = usePermissions()
  // ... rest of code
```

### Step 3: Define Allowed Actions
```jsx
const allowedActions = []
if (can(PERMISSIONS.EDIT_XXX)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_XXX)) allowedActions.push('delete')
```

### Step 4: Conditionally Pass Handlers
```jsx
<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_XXX) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_XXX) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_XXX) ? handleDelete : undefined}
  onStatusToggle={can(PERMISSIONS.EDIT_XXX) ? handleStatusToggle : undefined}
  onBulkDelete={can(PERMISSIONS.DELETE_XXX) ? handleBulkDelete : undefined}
  actions={allowedActions}
/>
```

## 📋 Apply to These Components

### 1. StaffTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_STAFF)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_STAFF)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_STAFF) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_STAFF) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_STAFF) ? handleDelete : undefined}
  onStatusToggle={can(PERMISSIONS.EDIT_STAFF) ? handleStatusToggle : undefined}
  actions={allowedActions}
/>
```

### 2. CourseTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_COURSE)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_COURSE)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_COURSE) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_COURSE) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_COURSE) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 3. SubjectTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_SUBJECT)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_SUBJECT)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_SUBJECT) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_SUBJECT) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_SUBJECT) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 4. BatchTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_BATCH)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_BATCH)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_BATCH) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_BATCH) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_BATCH) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 5. ClassTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_CLASS)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_CLASS)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_CLASS) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_CLASS) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_CLASS) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 6. TimeTableTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_TIMETABLE)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_TIMETABLE)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_TIMETABLE) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_TIMETABLE) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_TIMETABLE) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 7. QuestionPaperTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_QUESTION_PAPER)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_QUESTION_PAPER)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_QUESTION_PAPER) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_QUESTION_PAPER) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_QUESTION_PAPER) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 8. ExamTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_EXAM)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_EXAM)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_EXAM) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_EXAM) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_EXAM) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 9. StudyMaterialTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_MATERIAL)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_MATERIAL)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.UPLOAD_MATERIAL) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_MATERIAL) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_MATERIAL) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 10. AttendanceTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_ATTENDANCE)) allowedActions.push('edit')

<GenericDataTable
  onAdd={can(PERMISSIONS.MARK_ATTENDANCE) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_ATTENDANCE) ? handleEdit : undefined}
  actions={allowedActions}
/>
```

### 11. ResultTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_RESULT)) allowedActions.push('edit')
if (can(PERMISSIONS.DELETE_RESULT)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_RESULT) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_RESULT) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_RESULT) ? handleDelete : undefined}
  actions={allowedActions}
/>
```

### 12. UsersTable.jsx
```jsx
const { can } = usePermissions()

const allowedActions = []
if (can(PERMISSIONS.EDIT_USER)) allowedActions.push('edit', 'toggle')
if (can(PERMISSIONS.DELETE_USER)) allowedActions.push('delete')

<GenericDataTable
  onAdd={can(PERMISSIONS.CREATE_USER) ? handleAdd : undefined}
  onEdit={can(PERMISSIONS.EDIT_USER) ? handleEdit : undefined}
  onDelete={can(PERMISSIONS.DELETE_USER) ? handleDelete : undefined}
  onStatusToggle={can(PERMISSIONS.EDIT_USER) ? handleStatusToggle : undefined}
  actions={allowedActions}
/>
```

## 🎯 Result
- **Admin**: Sees all buttons (Add, Edit, Delete, Toggle)
- **Staff**: Sees buttons based on their permissions
- **Student**: Sees no action buttons (view only)

## ⚡ Quick Copy-Paste Template

```jsx
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'

const MyTable = () => {
  const { can } = usePermissions()
  
  // Replace XXX with your entity (STUDENT, STAFF, COURSE, etc.)
  const allowedActions = []
  if (can(PERMISSIONS.EDIT_XXX)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_XXX)) allowedActions.push('delete')

  return (
    <GenericDataTable
      onAdd={can(PERMISSIONS.CREATE_XXX) ? handleAdd : undefined}
      onEdit={can(PERMISSIONS.EDIT_XXX) ? handleEdit : undefined}
      onDelete={can(PERMISSIONS.DELETE_XXX) ? handleDelete : undefined}
      onStatusToggle={can(PERMISSIONS.EDIT_XXX) ? handleStatusToggle : undefined}
      onBulkDelete={can(PERMISSIONS.DELETE_XXX) ? handleBulkDelete : undefined}
      actions={allowedActions}
    />
  )
}
```

## ✅ Checklist
- [ ] StaffTable
- [ ] CourseTable
- [ ] SubjectTable
- [ ] BatchTable
- [ ] ClassTable
- [ ] TimeTableTable
- [ ] QuestionPaperTable
- [ ] ExamTable
- [ ] StudyMaterialTable
- [ ] AttendanceTable
- [ ] ResultTable
- [ ] UsersTable
