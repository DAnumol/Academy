# Re-Exam Implementation Guide

## Current System Analysis

### Database Schema Overview

#### 1. QuestionPaper Model
- **Primary Key**: `qpId`
- **Key Fields**: 
  - `title`, `description`, `examDate`, `startTime`
  - `totalMarks`, `duration`, `marksPerCorrect`, `marksPerIncorrect`
  - `questionSet` (JSON), `fileUrl`, `status`
- **Relationships**: 
  - One QuestionPaper → Many Exams

#### 2. Exam Model
- **Primary Key**: `examId`
- **Key Fields**: 
  - `qpId` (FK to QuestionPaper)
  - `batchId` (FK to Batch)
  - `date`, `status`
- **Relationships**: 
  - One Exam → Many Results
  - One Exam → One QuestionPaper

#### 3. Result Model
- **Primary Key**: `resultId`
- **Key Fields**: 
  - `studentId` (FK to Student)
  - `examId` (FK to Exam)
  - `totalMarks`, `obtainedMarks`, `percentage`, `grade`
  - `studentAnswers` (JSON), `violations` (JSON), `violationCount`
  - `status`
- **Current Constraint**: One student can have only ONE result per exam

---

## Re-Exam Implementation Strategy

### Option 1: Simple Approach (Recommended for Quick Implementation)

#### Database Changes
**Add to Result Model:**
```javascript
attemptNumber: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1
}
```

**Migration File:**
```javascript
// migrations/YYYYMMDDHHMMSS-add-attempt-number-to-results.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('results', 'attemptNumber', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('results', 'attemptNumber');
  }
};
```

#### Backend Changes

**1. Update Result Model Constraint:**
- Remove unique constraint on `(studentId, examId)` if exists
- Add composite unique constraint on `(studentId, examId, attemptNumber)`

**2. Update examController.js - getStudentExams():**
```javascript
// Current logic checks: const result = await Result.findOne(...)
// Change to:
const results = await Result.findAll({ 
  where: { examId: exam.examId, studentId: student.studentId },
  order: [['attemptNumber', 'DESC']]
});

return {
  ...exam.toJSON(),
  attempted: results.length > 0,
  attemptCount: results.length,
  lastAttempt: results[0] || null,
  canRetake: results.length < 3, // Max 3 attempts
  resultId: results[0]?.resultId,
  studentAnswers: results[0]?.studentAnswers
};
```

**3. Update examController.js - submitExam():**
```javascript
// Before creating result, get attempt count
const existingResults = await Result.findAll({ 
  where: { examId, studentId: student.studentId } 
});

const attemptNumber = existingResults.length + 1;

// Check max attempts
if (attemptNumber > 3) {
  return sendError(res, 400, 'Maximum attempt limit reached');
}

// Create result with attemptNumber
const result = await Result.create({
  resultId: generateIds.result(),
  studentId: student.studentId,
  examId,
  attemptNumber,
  // ... rest of fields
});
```

#### Frontend Changes

**1. Update StudentExamPage.jsx:**
```javascript
// Show attempt information
{exam.attemptCount > 0 && (
  <div className="text-xs text-gray-600 dark:text-gray-400">
    Attempts: {exam.attemptCount}/3
  </div>
)}

// Update button logic
{exam.attemptCount > 0 && exam.canRetake ? (
  <button
    onClick={() => handleStartExam(exam)}
    disabled={!available}
    className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
  >
    Retake Exam
  </button>
) : exam.attemptCount >= 3 ? (
  <button disabled className="w-full py-2 px-4 bg-gray-400 cursor-not-allowed text-gray-200">
    Max Attempts Reached
  </button>
) : (
  // Original Start Exam button
)}
```

**2. Update Result Display:**
```javascript
// Show all attempts with scores
{exam.attemptCount > 1 && (
  <div className="text-xs">
    <span>Best Score: {exam.bestScore}%</span>
    <span>Last Score: {exam.lastAttempt?.percentage}%</span>
  </div>
)}
```

---

### Option 2: Advanced Approach (Better Control)

#### Database Changes
**Add new table: ExamAttempts**
```javascript
// models/ExamAttempt.js
module.exports = (sequelize, DataTypes) => {
  const ExamAttempt = sequelize.define('ExamAttempt', {
    attemptId: {
      type: DataTypes.STRING(20),
      primaryKey: true
    },
    examId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    allowRetake: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    retakeReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'exam_attempts',
    timestamps: true
  });
  
  return ExamAttempt;
};
```

**Add to Exam Model:**
```javascript
allowRetake: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
},
maxAttempts: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1
}
```

#### Benefits of Option 2:
- Per-exam retake configuration
- Staff can enable/disable retakes for specific exams
- Track retake reasons
- More granular control

---

## Implementation Steps

### Phase 1: Database (Day 1)
1. Create migration for `attemptNumber` field in results table
2. Run migration: `npx sequelize-cli db:migrate`
3. Update Result model with new field
4. Test database changes

### Phase 2: Backend (Day 2)
1. Update `getStudentExams()` to return attempt information
2. Update `submitExam()` to handle multiple attempts
3. Add validation for max attempts
4. Test API endpoints

### Phase 3: Frontend (Day 3)
1. Update StudentExamPage to show attempt count
2. Add "Retake Exam" button logic
3. Display attempt history
4. Show best score vs last score
5. Test UI flow

### Phase 4: Admin Features (Day 4)
1. Add "Allow Retake" toggle in Exam management
2. Add "Max Attempts" field in Exam form
3. Show attempt statistics in Results page
4. Add bulk retake permission feature

---

## Configuration Options

### Retake Rules (Choose based on requirements)

**Option A: Unlimited Retakes**
```javascript
maxAttempts: null // or 999
```

**Option B: Limited Retakes (Recommended)**
```javascript
maxAttempts: 3
```

**Option C: Staff-Controlled**
```javascript
// Staff manually enables retake per student
allowRetake: true/false (per exam per student)
```

**Option D: Time-Based**
```javascript
retakeAvailableAfter: 24 // hours
```

---

## API Endpoints to Add/Modify

### Backend Routes

**1. Get Student Exam Attempts**
```
GET /api/exams/:examId/attempts
Response: [{ attemptNumber, score, date, resultId }]
```

**2. Check Retake Eligibility**
```
GET /api/exams/:examId/can-retake
Response: { canRetake: true/false, reason: "..." }
```

**3. Enable Retake (Admin)**
```
POST /api/exams/:examId/enable-retake
Body: { studentId, maxAttempts }
```

---

## UI/UX Considerations

### Student View
- Show attempt count badge (1/3, 2/3, etc.)
- Different button colors:
  - Blue: First attempt
  - Orange: Retake
  - Gray: Max attempts reached
- Display best score prominently
- Show improvement/decline indicator

### Admin View
- Attempt history table per student
- Enable/disable retake toggle
- Set max attempts per exam
- View attempt analytics

---

## Testing Checklist

- [ ] Student can take exam first time
- [ ] Student can retake exam if allowed
- [ ] Max attempts limit is enforced
- [ ] Best score is tracked correctly
- [ ] All attempts are stored separately
- [ ] UI shows correct attempt count
- [ ] Retake button appears only when eligible
- [ ] Admin can view all attempts
- [ ] Results page shows all attempts

---

## Recommended Approach

**Start with Option 1 (Simple Approach)** because:
1. Minimal database changes
2. Quick implementation (2-3 days)
3. Easy to test
4. Can upgrade to Option 2 later if needed

**Key Implementation Priority:**
1. Add `attemptNumber` field to Result model ✓
2. Update backend logic to allow multiple results ✓
3. Update frontend to show retake button ✓
4. Add attempt count display ✓
5. (Optional) Add admin controls for retake permissions

---

## Code Files to Modify

### Backend
- `models/Result.js` - Add attemptNumber field
- `controllers/examController.js` - Update getStudentExams() and submitExam()
- `migrations/` - Create new migration file

### Frontend
- `src/features/exam/pages/StudentExamPage.jsx` - Add retake UI
- `src/features/exam/components/ExamAttempt.jsx` - No changes needed
- `src/features/results/` - Show attempt history

---

## Estimated Timeline

- **Option 1**: 2-3 days
- **Option 2**: 5-7 days (with admin features)

Choose Option 1 for MVP, then enhance with Option 2 features based on feedback.
