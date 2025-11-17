# NEET Academy API Documentation

**Base URL:** `http://localhost:5000/api`

## Authentication

### Login
```javascript
POST /api/auth/login
{
  "email": "admin@neetacademy.com",
  "password": "admin123"
}
```

### Register
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Get Profile
```javascript
GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
```

## Students

```javascript
// Create Student
POST /api/students
Headers: { Authorization: "Bearer <admin_token>" }
FormData: {
  name, email, password, dob, gender, address, phone, batchId, courseId, rollNo, profilePic
}

// Get All Students
GET /api/students?page=1&limit=10&batchId=B001&status=active
Headers: { Authorization: "Bearer <token>" }

// Get Student by ID
GET /api/students/STU001
Headers: { Authorization: "Bearer <token>" }

// Update Student
PUT /api/students/STU001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Student
DELETE /api/students/STU001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Staff

```javascript
// Create Staff
POST /api/staff
Headers: { Authorization: "Bearer <admin_token>" }
FormData: {
  name, email, password, subjectExpertise, phone, qualification, experience, profilePic
}

// Get All Staff
GET /api/staff?page=1&limit=10&status=active
Headers: { Authorization: "Bearer <token>" }

// Get Staff by ID
GET /api/staff/STF001
Headers: { Authorization: "Bearer <token>" }

// Update Staff
PUT /api/staff/STF001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Staff
DELETE /api/staff/STF001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Courses

```javascript
// Create Course
POST /api/courses
Headers: { Authorization: "Bearer <admin_token>" }
{
  "courseName": "NEET Foundation Course",
  "duration": "24 months",
  "description": "Comprehensive NEET preparation",
  "fees": 150000,
  "subjectIds": ["SUB001", "SUB002"],
  "eligibility": "10th pass"
}

// Get All Courses
GET /api/courses?page=1&limit=10&status=active
Headers: { Authorization: "Bearer <token>" }

// Get Course by ID
GET /api/courses/C001
Headers: { Authorization: "Bearer <token>" }

// Update Course
PUT /api/courses/C001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Course
DELETE /api/courses/C001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Subjects

```javascript
// Create Subject
POST /api/subjects
Headers: { Authorization: "Bearer <admin_token>" }
{
  "name": "Physics",
  "code": "PHY101",
  "staffId": "STF001"
}

// Get All Subjects
GET /api/subjects
Headers: { Authorization: "Bearer <token>" }

// Get Subject by ID
GET /api/subjects/SUB001
Headers: { Authorization: "Bearer <token>" }

// Update Subject
PUT /api/subjects/SUB001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Subject
DELETE /api/subjects/SUB001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Batches

```javascript
// Create Batch
POST /api/batches
Headers: { Authorization: "Bearer <admin_token>" }
{
  "batchName": "Morning Batch A - 2024",
  "courseId": "C001",
  "staffIds": ["STF001", "STF002"],
  "studentIds": ["STU001", "STU002"],
  "startDate": "2024-04-01",
  "endDate": "2026-03-31"
}

// Get All Batches
GET /api/batches?page=1&limit=10&status=active&courseId=C001
Headers: { Authorization: "Bearer <token>" }

// Get Batch by ID
GET /api/batches/B001
Headers: { Authorization: "Bearer <token>" }

// Update Batch
PUT /api/batches/B001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Batch
DELETE /api/batches/B001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Classes

```javascript
// Create Class
POST /api/classes
Headers: { Authorization: "Bearer <admin_token>" }
{
  "className": "Physics Advanced",
  "batchId": "B001",
  "staffIds": ["STF001"],
  "studentIds": ["STU001", "STU002"],
  "subjectIds": ["SUB001"]
}

// Get All Classes
GET /api/classes?page=1&limit=10&batchId=B001&status=active
Headers: { Authorization: "Bearer <token>" }

// Get Class by ID
GET /api/classes/CLS001
Headers: { Authorization: "Bearer <token>" }

// Update Class
PUT /api/classes/CLS001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Class
DELETE /api/classes/CLS001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Timetables

```javascript
// Create Timetable
POST /api/timetables
Headers: { Authorization: "Bearer <admin_token>" }
{
  "batchId": "B001",
  "weekStartDate": "2024-11-04",
  "schedule": [
    {
      "day": "Monday",
      "subjectId": "SUB001",
      "startTime": "08:00",
      "endTime": "10:00",
      "staffId": "STF001",
      "roomNo": "101"
    }
  ]
}

// Get All Timetables
GET /api/timetables?batchId=B001
Headers: { Authorization: "Bearer <token>" }

// Get Timetable by ID
GET /api/timetables/TT001
Headers: { Authorization: "Bearer <token>" }

// Update Timetable
PUT /api/timetables/TT001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Timetable
DELETE /api/timetables/TT001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Question Papers

```javascript
// Create Question Paper
POST /api/questionpapers
Headers: { Authorization: "Bearer <staff_token>" }
FormData: {
  courseId: "C001",
  subjectId: "SUB001",
  batchId: "B001",
  title: "Physics Unit Test 1",
  description: "Mechanics and Thermodynamics",
  examDate: "2024-11-15",
  totalMarks: 100,
  duration: 180,
  questionSet: JSON.stringify([
    {
      "questionText": "What is Newton's first law?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A"
    }
  ]),
  questionPaper: <file>
}

// Get All Question Papers
GET /api/questionpapers?page=1&limit=10&subjectId=SUB001&batchId=B001
Headers: { Authorization: "Bearer <token>" }

// Get Question Paper by ID
GET /api/questionpapers/QP001
Headers: { Authorization: "Bearer <token>" }

// Update Question Paper
PUT /api/questionpapers/QP001
Headers: { Authorization: "Bearer <staff_token>" }

// Delete Question Paper
DELETE /api/questionpapers/QP001
Headers: { Authorization: "Bearer <staff_token>" }
```

## Attendance

```javascript
// Mark Attendance
POST /api/attendance
Headers: { Authorization: "Bearer <staff_token>" }
{
  "batchId": "B001",
  "subjectId": "SUB001",
  "date": "2024-11-04",
  "records": [
    { "studentId": "STU001", "status": "Present" },
    { "studentId": "STU002", "status": "Absent" }
  ]
}

// Get Attendance
GET /api/attendance?page=1&limit=10&batchId=B001&subjectId=SUB001&date=2024-11-04
Headers: { Authorization: "Bearer <token>" }

// Get Attendance by ID
GET /api/attendance/ATT001
Headers: { Authorization: "Bearer <token>" }

// Update Attendance
PUT /api/attendance/ATT001
Headers: { Authorization: "Bearer <staff_token>" }

// Delete Attendance
DELETE /api/attendance/ATT001
Headers: { Authorization: "Bearer <staff_token>" }
```

## Materials

```javascript
// Upload Material
POST /api/materials
Headers: { Authorization: "Bearer <staff_token>" }
FormData: {
  subjectId: "SUB001",
  title: "Newton's Laws Notes",
  description: "Comprehensive notes on mechanics",
  material: <file>
}

// Get All Materials
GET /api/materials?page=1&limit=10&subjectId=SUB001
Headers: { Authorization: "Bearer <token>" }

// Get Material by ID
GET /api/materials/MAT001
Headers: { Authorization: "Bearer <token>" }

// Update Material
PUT /api/materials/MAT001
Headers: { Authorization: "Bearer <staff_token>" }

// Delete Material
DELETE /api/materials/MAT001
Headers: { Authorization: "Bearer <staff_token>" }
```

## Exams

```javascript
// Create Exam
POST /api/exams
Headers: { Authorization: "Bearer <admin_token>" }
{
  "courseId": "C001",
  "qpId": "QP001",
  "batchId": "B001",
  "date": "2024-11-15"
}

// Get All Exams
GET /api/exams?page=1&limit=10&batchId=B001&status=scheduled
Headers: { Authorization: "Bearer <token>" }

// Get Exam by ID
GET /api/exams/EXM001
Headers: { Authorization: "Bearer <token>" }

// Update Exam
PUT /api/exams/EXM001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Exam
DELETE /api/exams/EXM001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Results

```javascript
// Create Result
POST /api/results
Headers: { Authorization: "Bearer <staff_token>" }
{
  "studentId": "STU001",
  "examId": "EXM001",
  "totalMarks": 100,
  "obtainedMarks": 85,
  "grade": "A",
  "remarks": "Excellent performance"
}

// Get All Results
GET /api/results?page=1&limit=10&studentId=STU001&examId=EXM001
Headers: { Authorization: "Bearer <token>" }

// Get Result by ID
GET /api/results/RES001
Headers: { Authorization: "Bearer <token>" }

// Update Result
PUT /api/results/RES001
Headers: { Authorization: "Bearer <staff_token>" }

// Delete Result
DELETE /api/results/RES001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Notifications

```javascript
// Create Notification
POST /api/notifications
Headers: { Authorization: "Bearer <admin_token>" }
{
  "title": "Exam Schedule",
  "message": "Physics exam scheduled for Nov 15",
  "forRole": "student",
  "targetBatchIds": ["B001", "B002"]
}

// Get All Notifications
GET /api/notifications?page=1&limit=10&forRole=student
Headers: { Authorization: "Bearer <token>" }

// Get Notification by ID
GET /api/notifications/NOT001
Headers: { Authorization: "Bearer <token>" }

// Update Notification
PUT /api/notifications/NOT001
Headers: { Authorization: "Bearer <admin_token>" }

// Delete Notification
DELETE /api/notifications/NOT001
Headers: { Authorization: "Bearer <admin_token>" }
```

## Dashboard

```javascript
// Admin Dashboard
GET /api/dashboard/admin
Headers: { Authorization: "Bearer <admin_token>" }

// Staff Dashboard
GET /api/dashboard/staff
Headers: { Authorization: "Bearer <staff_token>" }

// Student Dashboard
GET /api/dashboard/student
Headers: { Authorization: "Bearer <student_token>" }
```

## Health Check

```javascript
GET /api/health
// No authentication required
```

## Sample Login Credentials

```javascript
const credentials = {
  admin: {
    email: "admin@neetacademy.com",
    password: "admin123"
  },
  staff: {
    email: "priya.sharma@neetacademy.com",
    password: "staff123"
  },
  student: {
    email: "arun.patel@student.neetacademy.com",
    password: "student123"
  }
};
```

## Frontend Integration Examples

### React/JavaScript Integration

```javascript
// API Base Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Login Function
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// Get Students Function
const getStudents = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/students?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Create Student Function
const createStudent = async (studentData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  Object.keys(studentData).forEach(key => {
    if (studentData[key] !== null && studentData[key] !== undefined) {
      formData.append(key, studentData[key]);
    }
  });

  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};

// Upload Material Function
const uploadMaterial = async (materialData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  formData.append('subjectId', materialData.subjectId);
  formData.append('title', materialData.title);
  formData.append('description', materialData.description);
  formData.append('material', materialData.file);

  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};

// Mark Attendance Function
const markAttendance = async (attendanceData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(attendanceData),
  });
  return await response.json();
};

// Get Dashboard Data Function
const getDashboardData = async (role) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/dashboard/${role}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

## Response Format

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## File Upload Notes

- Profile pictures: `multipart/form-data` with field name `profilePic`
- Question papers: `multipart/form-data` with field name `questionPaper`
- Study materials: `multipart/form-data` with field name `material`
- Max file size: 10MB
- Supported formats: PDF, DOC, DOCX, PPT, PPTX, MP4, AVI, JPG, PNG

## Pagination

All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- Response includes: `totalCount`, `currentPage`, `totalPages`

## Authentication Flow

1. Login with credentials
2. Store JWT token from response
3. Include token in Authorization header for all protected routes
4. Token expires in 7 days (configurable)
5. Refresh token by logging in again

## Error Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error