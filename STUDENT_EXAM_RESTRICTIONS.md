# Student Exam Restrictions Implementation

## Overview
Implemented role-based restrictions for students accessing exams with date-based availability.

## Changes Made

### Backend Changes

#### examController.js - getAllExams()
**Purpose**: Filter exams based on user role

**Changes**:
- Added role check for students
- Students only see exams from their assigned batch
- Students only see active exams (status = true)
- Admin/Staff see all exams with optional filters

**Logic**:
```javascript
if (role === 'student') {
  // Find student's batch
  const student = await Student.findOne({ where: { userId } });
  // Filter by student's batch and active status only
  where.batchId = student.batchId;
  where.status = true;
} else {
  // Admin/Staff can filter by any batch and status
  if (batchId) where.batchId = batchId;
  if (status) where.status = status;
}
```

### Frontend Changes

#### 1. ExamTable.jsx
**Purpose**: Hide action buttons for students

**Changes**:
- Import useAuthStore to get user role
- Check if user role is 'student'
- Conditionally hide all CRUD actions for students
- Students see read-only exam list

**Implementation**:
```javascript
const isStudent = user?.role === 'student'

// Hide all actions for students
onAdd={!isStudent ? handleAdd : undefined}
onEdit={!isStudent ? handleEdit : undefined}
onDelete={!isStudent ? handleDelete : undefined}
onStatusToggle={!isStudent ? handleStatusToggle : undefined}
onBulkDelete={!isStudent ? handleBulkDelete : undefined}
actions={isStudent ? [] : ['edit', 'toggle', 'delete']}
```

#### 2. StudentExamPage.jsx
**Purpose**: Enable exam start only on or after exam date

**Changes**:
- Added date validation in handleStartExam()
- Disabled "Start Exam" button before exam date
- Visual feedback showing availability date
- Button text changes based on availability

**Date Validation Logic**:
```javascript
const examDate = new Date(exam.date)
const today = new Date()
examDate.setHours(0, 0, 0, 0)
today.setHours(0, 0, 0, 0)

if (today < examDate) {
  showToast.error('Exam is not available yet')
  return
}
```

**UI Changes**:
- Button disabled if exam date is in future
- Button shows "Not Available Yet" when disabled
- Shows "Available on [date]" message below exam info
- Button enabled and shows "Start Exam" on/after exam date

## User Experience

### For Students:
1. **Exam List (/Exams)**:
   - See only exams from their batch
   - See only active exams
   - No action buttons (edit/delete/toggle)
   - Read-only view

2. **My Exams (/student/exams)**:
   - See all their batch exams
   - "Start Exam" button disabled before exam date
   - Visual indicator showing when exam becomes available
   - Error message if trying to start before date
   - Can view answers after attempting

### For Admin/Staff:
1. **Exam List (/Exams)**:
   - See all exams
   - Full CRUD operations available
   - Can filter by batch and status
   - Can toggle exam status

## API Behavior

### GET /api/exams
**For Students**:
- Returns only exams from student's batch
- Returns only active exams (status = true)
- Automatically filtered, no manual filter needed

**For Admin/Staff**:
- Returns all exams
- Can filter by batchId and status via query params
- Full access to all exam data

## Security
- Backend enforces role-based filtering
- Students cannot access other batches' exams
- Students cannot see inactive exams
- Date validation on both frontend and backend
- Frontend restrictions backed by backend authorization

## Date Validation Rules
1. Exam date compared at day level (time ignored)
2. Exam available on exam date at 00:00:00
3. Exam remains available after exam date
4. Already attempted exams show "View Answers" regardless of date
5. Toast notification if student tries to start early

## Visual Indicators
- **Before Exam Date**: 
  - Gray disabled button
  - "Not Available Yet" text
  - Yellow text showing availability date
  
- **On/After Exam Date**:
  - Blue enabled button
  - "Start Exam" text
  - No restriction message

- **Already Attempted**:
  - Green button
  - "View Answers" text
  - Green checkmark icon
