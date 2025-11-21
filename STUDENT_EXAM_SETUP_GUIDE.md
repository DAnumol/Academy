# Student Exam System - Quick Setup Guide

## Prerequisites
- Backend server running
- Database configured
- Student user created and assigned to a batch
- Question papers created with questionSet JSON

## Step-by-Step Setup

### 1. Create Question Paper with Questions

When creating a question paper, ensure the `questionSet` field contains questions in this format:

```json
[
  {
    "id": "q1",
    "question": "What is the capital of France?",
    "type": "mcq",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": "Paris",
    "marks": 2
  },
  {
    "id": "q2",
    "question": "Explain the concept of inheritance in OOP.",
    "type": "text",
    "marks": 5
  }
]
```

### 2. Create Exam

Create an exam linking:
- Question Paper (qpId)
- Batch (batchId)
- Date
- Status (must be `true` for active)

### 3. Assign Student to Batch

Ensure the student record has:
- Valid `batchId` matching the exam's batch
- Active status

### 4. Student Login

Student logs in with credentials:
- Role must be `student`
- User must have associated student record

### 5. Access Exam

Student navigates to:
- **My Exams** (sidebar menu)
- Only sees exams for their batch
- Can start exams not yet attempted

### 6. Attempt Exam

- Click "Start Exam"
- Timer starts automatically
- Answer questions
- Submit manually or wait for auto-submit

### 7. View Results

Student navigates to:
- **My Results** (sidebar menu)
- See all exam results
- View statistics and grades

## Database Requirements

### Question Paper Table
```sql
questionSet JSON field example:
[
  {
    "id": "q1",
    "question": "Question text",
    "type": "mcq" | "text",
    "options": ["opt1", "opt2"], -- for MCQ only
    "correctAnswer": "opt1", -- for MCQ only
    "marks": 2
  }
]
```

### Exam Table
- examId (PK)
- qpId (FK to questionpapers)
- batchId (FK to batches)
- date
- status (boolean, true = active)

### Student Table
- studentId (PK)
- userId (FK to users)
- batchId (FK to batches)
- Other student details

### Result Table
- resultId (PK)
- studentId (FK to students)
- examId (FK to exams)
- totalMarks
- obtainedMarks
- percentage
- grade
- remarks

## API Testing

### 1. Get Student Exams
```bash
curl -X GET http://localhost:5000/api/exams/student/my-exams \
  -H "Authorization: Bearer <student_token>"
```

### 2. Submit Exam
```bash
curl -X POST http://localhost:5000/api/exams/student/submit \
  -H "Authorization: Bearer <student_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "examId": "EXM123456789",
    "answers": {
      "q1": "Paris",
      "q2": "Inheritance allows..."
    }
  }'
```

### 3. Get Student Results
```bash
curl -X GET http://localhost:5000/api/results/student/my-results \
  -H "Authorization: Bearer <student_token>"
```

## Common Issues & Solutions

### Issue: Student sees no exams
**Solutions:**
- Check if student is assigned to a batch
- Verify exam's batchId matches student's batchId
- Ensure exam status is `true` (active)
- Check if exam date is set

### Issue: Timer not working
**Solutions:**
- Check browser console for errors
- Ensure duration is set in question paper
- Verify JavaScript is enabled

### Issue: Auto-submit not working
**Solutions:**
- Check if timer reaches 0
- Verify network connection
- Check browser console for API errors

### Issue: Results not showing
**Solutions:**
- Verify exam was submitted successfully
- Check if result was created in database
- Ensure student is logged in
- Check API endpoint permissions

### Issue: Grading incorrect
**Solutions:**
- Verify correctAnswer in questionSet
- Check answer format matches exactly
- Ensure MCQ answers are case-sensitive
- Text answers need manual grading

## Testing Workflow

### 1. Admin Setup
```
1. Login as admin
2. Create course, subject, batch
3. Create question paper with questionSet
4. Create exam linking QP and batch
5. Create student and assign to batch
```

### 2. Student Flow
```
1. Login as student
2. Navigate to "My Exams"
3. Click "Start Exam"
4. Answer questions
5. Submit or wait for auto-submit
6. Navigate to "My Results"
7. View grades and statistics
```

### 3. Verification
```
1. Check results table in database
2. Verify marks calculation
3. Check grade assignment
4. Verify exam status (attempted)
```

## Sample Data

### Sample Question Paper
```json
{
  "qpId": "QP123456789",
  "title": "JavaScript Basics",
  "subjectId": "SUB001",
  "batchId": "B001",
  "totalMarks": 20,
  "duration": 30,
  "questionSet": [
    {
      "id": "q1",
      "question": "What is JavaScript?",
      "type": "mcq",
      "options": [
        "Programming Language",
        "Markup Language",
        "Database",
        "Operating System"
      ],
      "correctAnswer": "Programming Language",
      "marks": 2
    },
    {
      "id": "q2",
      "question": "Explain closures in JavaScript.",
      "type": "text",
      "marks": 5
    }
  ]
}
```

### Sample Exam
```json
{
  "examId": "EXM123456789",
  "qpId": "QP123456789",
  "batchId": "B001",
  "date": "2024-02-01",
  "status": true
}
```

### Sample Student
```json
{
  "studentId": "STU123456789",
  "userId": "U123456789",
  "batchId": "B001",
  "name": "John Doe",
  "rollNo": "2024001"
}
```

## Environment Variables

Ensure these are set in `.env`:

```env
# Backend
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=academy_db
JWT_SECRET=your_secret_key

# Frontend
VITE_API_BASE_URL=http://localhost:5000/api
```

## Permissions Required

### Student Role Permissions:
- `ATTEMPT_EXAM` - Access My Exams page
- `VIEW_RESULTS` - Access My Results page
- `VIEW_MATERIALS` - Access study materials
- `VIEW_TIMETABLE` - Access timetable
- `VIEW_ATTENDANCE` - View attendance

These are already configured in `rolePermissions.js`.

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify database records
4. Review API responses
5. Check permission configurations

## Next Steps

After setup:
1. Test with multiple students
2. Create various question types
3. Test timer functionality
4. Verify grading accuracy
5. Check result statistics
6. Test edge cases (network issues, timeout, etc.)
