# Student Exam System - Quick Reference

## 🚀 Quick Start

### Admin Setup (3 steps)
```
1. Create Question Paper with questionSet JSON
2. Create Exam (link QP + Batch)
3. Ensure exam status = true
```

### Student Usage (3 steps)
```
1. Login → Navigate to "My Exams"
2. Click "Start Exam" → Answer questions
3. Submit → View results in "My Results"
```

## 📍 API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/exams/student/my-exams` | student | Get assigned exams |
| POST | `/api/exams/student/submit` | student | Submit exam answers |
| GET | `/api/results/student/my-results` | student | Get exam results |

## 🔑 Key Files

### Backend
```
controllers/examController.js    → getStudentExams, submitExam
controllers/resultController.js  → getStudentResults
routes/exams.js                  → Student exam routes
routes/results.js                → Student result route
```

### Frontend
```
features/exam/pages/StudentExamPage.jsx       → Exam list
features/exam/components/ExamAttempt.jsx      → Exam interface
features/results/pages/StudentResultPage.jsx  → Results page
services/examService.js                       → API calls
```

## 📊 Question Format

```json
{
  "id": "q1",
  "question": "Question text?",
  "type": "mcq",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "marks": 2
}
```

## 🎯 Grading Scale

| Grade | Percentage |
|-------|------------|
| A+ | 90-100% |
| A | 80-89% |
| B | 70-79% |
| C | 60-69% |
| D | 50-59% |
| F | Below 50% |

## 🔐 Permissions

| Permission | Access |
|------------|--------|
| `ATTEMPT_EXAM` | My Exams page |
| `VIEW_RESULTS` | My Results page |
| `CREATE_EXAM` | Admin exam management |
| `CREATE_RESULT` | Admin result management |

## ⏱️ Timer Features

- Countdown in MM:SS format
- Red warning when < 5 minutes
- Auto-submit at 0:00
- Manual submit anytime

## 🎨 UI Components

### Student Exam Page
- Grid of exam cards
- Status badges (attempted/pending)
- Exam details (duration, marks, date)
- Start button (disabled if attempted)

### Exam Attempt
- Sticky header with timer
- Question counter
- MCQ radio buttons
- Text area for text questions
- Submit button with confirmation

### Results Page
- Statistics cards (total, average, highest)
- Results list with grades
- Color-coded grade badges
- Remarks display

## 🔄 Workflow

```
Admin: Create QP → Create Exam → Assign to Batch
Student: View Exams → Start → Answer → Submit
System: Grade MCQs → Save Result → Show Statistics
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No exams showing | Check batch assignment |
| Timer not working | Check browser console |
| Can't submit | Check network/API |
| Wrong grade | Verify correctAnswer |
| No results | Check result creation |

## 📝 Sample Request

### Submit Exam
```bash
POST /api/exams/student/submit
Headers: { Authorization: "Bearer <token>" }
Body: {
  "examId": "EXM123456789",
  "answers": {
    "q1": "Paris",
    "q2": "Text answer here"
  }
}
```

## 🎓 Navigation

### Student Sidebar
- Dashboard
- **My Exams** ← New
- **My Results** ← New
- Study Materials
- Timetable
- Attendance

### Admin Sidebar
- Dashboard
- Users/Students/Staff
- Courses/Subjects/Batches
- **Exams** (Management)
- **Results** (Management)
- Question Papers

## ✅ Checklist

### Before Testing
- [ ] Database running
- [ ] Backend server running
- [ ] Frontend dev server running
- [ ] Student user created
- [ ] Student assigned to batch
- [ ] Question paper created
- [ ] Exam created and active

### During Testing
- [ ] Student can login
- [ ] Exams appear in list
- [ ] Timer starts on exam start
- [ ] Questions display correctly
- [ ] Answers can be selected
- [ ] Submit works (manual/auto)
- [ ] Results appear correctly

## 🔗 Related Files

- `STUDENT_EXAM_IMPLEMENTATION.md` - Full technical docs
- `STUDENT_EXAM_SETUP_GUIDE.md` - Detailed setup
- `STUDENT_EXAM_SUMMARY.md` - Implementation overview

## 💡 Pro Tips

1. **Question Set**: Always validate JSON before saving
2. **Timer**: Test with short duration first (e.g., 2 minutes)
3. **Batch**: Ensure student's batchId matches exam's batchId
4. **Status**: Inactive exams won't show to students
5. **Grading**: Text answers need manual grading later

## 🎯 Key Features

✅ Role-based access
✅ Batch filtering
✅ Timer with auto-submit
✅ MCQ auto-grading
✅ Result statistics
✅ Duplicate prevention
✅ Responsive design
✅ Error handling

## 📞 Quick Help

**Can't see exams?**
→ Check batch assignment and exam status

**Timer issues?**
→ Check browser console and duration field

**Grading wrong?**
→ Verify correctAnswer matches exactly

**No results?**
→ Check if exam was submitted successfully

---

**Ready to test?** Follow the Quick Start section above! 🚀
