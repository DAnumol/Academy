# Student Exam Implementation

## Overview
Implemented a complete student exam system with role-based access, timer functionality, auto-submit, result tracking, and result viewing. Students can now:
- View exams assigned to their batch
- Attempt exams with countdown timer
- Auto-submit when time expires
- View their results with statistics
- See performance metrics and grades

## Backend Changes

### 1. Exam Controller (`Backend/controllers/examController.js`)
Added two new endpoints:

#### `getStudentExams`
- Fetches exams assigned to student's batch
- Filters by active status
- Includes attempt status for each exam
- Returns exam details with question paper info

#### `submitExam`
- Validates student and exam
- Prevents duplicate submissions
- Auto-calculates marks for MCQ questions
- Calculates percentage and grade
- Creates result record

### 2. Exam Routes (`Backend/routes/exams.js`)
Added new routes:
- `GET /exams/student/my-exams` - Get student's assigned exams
- `POST /exams/student/submit` - Submit exam answers

Both routes require `student` role authorization.

## Frontend Changes

### 1. Services

#### Exam Service (`Frontend/src/services/examService.js`)
Added methods:
- `getStudentExams()` - Fetch student's exams
- `submitExam(examId, answers)` - Submit exam with answers
- Legacy aliases: `getMyExams()`, `submit()`

#### Result Service (`Frontend/src/services/resultService.js`)
Added methods:
- `getMyResults()` - Fetch student's results
- Legacy alias: `getStudentResults()`

### 2. Student Exam Page (`Frontend/src/features/exam/pages/StudentExamPage.jsx`)
Features:
- Displays all assigned exams
- Shows exam status (attempted/not attempted)
- Displays exam details (duration, marks, date)
- Start exam button (disabled if already attempted)
- Responsive grid layout

### 3. Exam Attempt Component (`Frontend/src/features/exam/components/ExamAttempt.jsx`)
Features:
- **Timer**: Countdown timer with auto-submit when time expires
- **Question Display**: Supports MCQ and text questions
- **Answer Tracking**: Real-time answer count
- **Auto-Save**: Timer-based auto-submit
- **Manual Submit**: Confirmation dialog before submission
- **Visual Feedback**: Color-coded timer (red when < 5 minutes)
- **Progress Tracking**: Shows answered vs total questions

### 4. Student Result Page (`Frontend/src/features/results/pages/StudentResultPage.jsx`)
Features:
- **Statistics Dashboard**: Shows total exams, average score, highest score
- **Results List**: Displays all exam results with details
- **Grade Display**: Color-coded grade badges
- **Performance Metrics**: Visual representation of performance
- **Remarks**: Shows teacher/admin remarks if available

### 5. Routes & Navigation
- Added `STUDENT_EXAMS` and `STUDENT_RESULTS` routes in constants
- Added routes in App.jsx with appropriate permissions
- Added "My Exams" and "My Results" links in sidebar (visible only to students)
- Updated sidebar permissions to show different menus for different roles

## Workflow

### Student Exam Flow:
1. **View Exams**: Student navigates to "My Exams"
2. **Filter**: Only exams for student's batch are shown
3. **Status Check**: Shows if exam is already attempted
4. **Start Exam**: Click "Start Exam" button
5. **Timer Starts**: Countdown begins automatically
6. **Answer Questions**: Select MCQ options or type text answers
7. **Submit Options**:
   - Manual: Click "Submit Exam" button
   - Auto: Timer expires and auto-submits
8. **Confirmation**: Confirm submission with answer count
9. **Result**: Exam is graded and result is saved
10. **Redirect**: Returns to exam list with updated status

## Grading Logic

### MCQ Questions:
- Automatically graded
- Correct answer = full marks
- Wrong/no answer = 0 marks

### Text Questions:
- Currently stored but not auto-graded
- Can be manually graded by staff/admin later

### Grade Calculation:
- A+: 90-100%
- A: 80-89%
- B: 70-79%
- C: 60-69%
- D: 50-59%
- F: Below 50%

## Security Features

1. **Role-Based Access**: Only students can access exam pages
2. **Batch Filtering**: Students only see exams for their batch
3. **Duplicate Prevention**: Cannot submit same exam twice
4. **Authentication**: All endpoints require valid JWT token
5. **Authorization**: Middleware checks student role

## Database Schema

### Exams Table:
- Links to batch (determines which students can take it)
- Links to question paper (contains questions)
- Status field (active/inactive)

### Results Table:
- Links to student and exam
- Stores marks, percentage, grade
- Prevents duplicate entries

### Question Papers:
- Contains `questionSet` JSON field with questions
- Each question has: id, question, type, options, correctAnswer, marks

## Question Format

```json
{
  "id": "q1",
  "question": "What is 2+2?",
  "type": "mcq",
  "options": ["2", "3", "4", "5"],
  "correctAnswer": "4",
  "marks": 2
}
```

## Files Created/Modified

### Backend Files:
1. `controllers/examController.js` - Added getStudentExams, submitExam
2. `controllers/resultController.js` - Added getStudentResults
3. `routes/exams.js` - Added student exam routes
4. `routes/results.js` - Added student result route

### Frontend Files:
1. `features/exam/pages/StudentExamPage.jsx` - NEW: Main exam listing page
2. `features/exam/components/ExamAttempt.jsx` - NEW: Exam attempt with timer
3. `features/results/pages/StudentResultPage.jsx` - NEW: Student results page
4. `services/examService.js` - Added student exam methods
5. `services/resultService.js` - Added student result methods
6. `utils/constants.js` - Added STUDENT_EXAMS, STUDENT_RESULTS routes
7. `App.jsx` - Added new routes with permissions
8. `components/layout/Sidebar.jsx` - Added student menu items

## Future Enhancements

1. **Manual Grading**: Interface for staff to grade text answers
2. **Partial Marks**: Support for partial credit
3. **Question Shuffle**: Randomize question order
4. **Answer Review**: Show correct answers after submission
5. **Exam Analytics**: Detailed performance statistics and charts
6. **Proctoring**: Camera/screen monitoring
7. **Offline Support**: Save answers locally
8. **Resume Exam**: Continue from where left off
9. **Exam History**: View past attempts and answers
10. **Performance Comparison**: Compare with class average

## Testing Checklist

### Exam Functionality
- [ ] Student can view assigned exams
- [ ] Timer counts down correctly
- [ ] Auto-submit works when timer expires
- [ ] Manual submit with confirmation works
- [ ] Answers are saved correctly
- [ ] MCQ grading is accurate
- [ ] Cannot submit same exam twice
- [ ] Only batch-specific exams are shown
- [ ] Permission checks work correctly
- [ ] Results are stored in database

### Result Functionality
- [ ] Student can view their results
- [ ] Statistics are calculated correctly
- [ ] Grade colors display properly
- [ ] Results are sorted by date
- [ ] Exam details are shown correctly
- [ ] Remarks are displayed if available

### Role-Based Access
- [ ] Students see "My Exams" and "My Results" in sidebar
- [ ] Admin/Staff see "Exams" and "Results" management
- [ ] Students cannot access admin exam management
- [ ] Students can only see their own results
- [ ] Unauthorized access is blocked

## API Endpoints

### Get Student Exams
```
GET /api/exams/student/my-exams
Authorization: Bearer <token>
Role: student
Response: Array of exams with attempt status
```

### Submit Exam
```
POST /api/exams/student/submit
Authorization: Bearer <token>
Role: student
Body: {
  "examId": "EXM123456789",
  "answers": {
    "q1": "option1",
    "q2": "text answer"
  }
}
Response: Created result with marks and grade
```

### Get Student Results
```
GET /api/results/student/my-results
Authorization: Bearer <token>
Role: student
Response: Array of results with exam details
```

## Navigation Structure

### For Students:
- Dashboard
- My Exams (ATTEMPT_EXAM permission)
- My Results (VIEW_RESULTS permission)
- Study Materials
- Timetable
- Attendance
- Profile

### For Admin/Staff:
- Dashboard
- Users/Students/Staff Management
- Courses/Subjects/Batches
- Exams Management (CREATE_EXAM permission)
- Results Management (CREATE_RESULT permission)
- Question Papers
- Study Materials
- Timetable
- Attendance

## Notes

- Timer runs in browser (client-side)
- Answers are only submitted once (on submit or timeout)
- Question papers must have `questionSet` JSON field populated
- Students must be assigned to a batch to see exams
- Exam status must be `true` (active) to be visible
- Results are automatically calculated for MCQ questions
- Text answers need manual grading by staff/admin
- Students can only view their own results
- Results page shows performance statistics
