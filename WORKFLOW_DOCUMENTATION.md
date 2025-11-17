# NEET Academy Management System - Complete Workflow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Tables Explained](#database-tables-explained)
3. [Step-by-Step Workflow](#step-by-step-workflow)
4. [CRUD Operations Guide](#crud-operations-guide)
5. [User Roles & Permissions](#user-roles-permissions)

---

## System Overview

**NEET Academy Management System** is a full-stack application for managing educational institutions. It consists of:
- **Backend**: Node.js + Express + MySQL + Sequelize ORM
- **Frontend**: React + Vite + TailwindCSS + Zustand

---

## Database Tables Explained

### 1. **users** Table
**Purpose**: Stores authentication and basic user information for all system users.

**Fields**:
- `userId` (Primary Key): Unique identifier (e.g., U001)
- `name`: Full name of the user
- `email`: Unique email for login
- `password`: Hashed password (bcrypt)
- `role`: User type (admin/staff/student)
- `status`: Active/Inactive (Boolean)
- `createdAt`, `updatedAt`: Timestamps

**Relationships**:
- One user → One student profile (if role = student)
- One user → One staff profile (if role = staff)

**Used For**: Login, authentication, role-based access control

---

### 2. **students** Table
**Purpose**: Stores detailed student information and academic records.

**Fields**:
- `studentId` (Primary Key): Unique student ID (e.g., STU001)
- `userId` (Foreign Key): Links to users table
- `name`: Student full name
- `dob`: Date of birth
- `gender`: Male/Female/Other
- `address`: Residential address
- `phone`: Contact number
- `email`: Student email
- `batchId` (Foreign Key): Assigned batch
- `courseId` (Foreign Key): Enrolled course
- `rollNo`: Unique roll number
- `profilePic`: Profile picture URL
- `status`: active/inactive

**Relationships**:
- Belongs to User (userId)
- Belongs to Batch (batchId)
- Belongs to Course (courseId)
- Has many Results

**Used For**: Student management, enrollment, attendance tracking, result generation

---

### 3. **staffs** Table
**Purpose**: Stores faculty/teacher information.

**Fields**:
- `staffId` (Primary Key): Unique staff ID (e.g., STF001)
- `userId` (Foreign Key): Links to users table
- `name`: Staff full name
- `subjectExpertise`: JSON array of subject IDs
- `phone`: Contact number
- `email`: Staff email
- `qualification`: Educational qualifications
- `experience`: Years of experience
- `batchId` (Foreign Key): Assigned batch
- `profilePic`: Profile picture (base64 or URL)
- `status`: Active/Inactive (Boolean)

**Relationships**:
- Belongs to User (userId)
- Belongs to Batch (batchId)
- Has many Subjects
- Has many Question Papers
- Has many Materials

**Used For**: Faculty management, subject assignment, teaching schedule

---

### 4. **courses** Table
**Purpose**: Stores course/program information.

**Fields**:
- `courseId` (Primary Key): Unique course ID (e.g., C001)
- `courseName`: Name of the course
- `duration`: Course duration (e.g., "24 months")
- `description`: Course details
- `fees`: Course fees (Decimal)
- `subjectIds`: JSON array of subject IDs
- `syllabusUrl`: Syllabus document URL
- `eligibility`: Eligibility criteria
- `status`: active/inactive/archived
- `createdBy` (Foreign Key): User who created

**Relationships**:
- Belongs to User (createdBy)
- Has many Students
- Has many Batches

**Used For**: Course catalog, enrollment, fee management

---

### 5. **subjects** Table
**Purpose**: Stores subject/topic information.

**Fields**:
- `subjectId` (Primary Key): Unique subject ID (e.g., SUB001)
- `name`: Subject name (e.g., "Physics")
- `code`: Subject code (e.g., "PHY101")
- `staffId` (Foreign Key): Assigned teacher
- `status`: Active/Inactive (Boolean)

**Relationships**:
- Belongs to Staff (staffId)
- Has many Question Papers
- Has many Materials

**Used For**: Subject management, teacher assignment, curriculum planning

---

### 6. **batches** Table
**Purpose**: Groups students and staff for a specific course period.

**Fields**:
- `batchId` (Primary Key): Unique batch ID (e.g., B001)
- `batchName`: Batch name (e.g., "Morning Batch A - 2024")
- `courseId` (Foreign Key): Associated course
- `staffIds`: JSON array of staff IDs
- `studentIds`: JSON array of student IDs
- `startDate`: Batch start date
- `endDate`: Batch end date
- `status`: active/inactive/completed

**Relationships**:
- Belongs to Course (courseId)
- Has many Students
- Has many Timetables

**Used For**: Grouping students, scheduling, batch-wise operations

---

### 7. **classes** Table
**Purpose**: Represents individual class sessions or groups within a batch.

**Fields**:
- `classId` (Primary Key): Unique class ID (e.g., CLS001)
- `className`: Class name
- `batchId` (Foreign Key): Parent batch
- `staffIds`: JSON array of teachers
- `studentIds`: JSON array of students
- `subjectIds`: JSON array of subjects
- `status`: active/inactive

**Relationships**:
- Belongs to Batch (batchId)

**Used For**: Class organization, subject-wise grouping

---

### 8. **timetables** Table
**Purpose**: Stores weekly schedules for batches.

**Fields**:
- `timetableId` (Primary Key): Unique timetable ID (e.g., TT001)
- `batchId` (Foreign Key): Associated batch
- `weekStartDate`: Week starting date
- `schedule`: JSON array of daily schedules
  ```json
  [
    {
      "day": "Monday",
      "subjectId": "SUB001",
      "startTime": "08:00",
      "endTime": "10:00",
      "staffId": "STF001",
      "roomNo": "101"
    }
  ]
  ```
- `createdBy` (Foreign Key): User who created

**Relationships**:
- Belongs to Batch (batchId)
- Belongs to User (createdBy)

**Used For**: Schedule management, class planning

---

### 9. **questionpapers** Table
**Purpose**: Stores exam question papers.

**Fields**:
- `qpId` (Primary Key): Unique question paper ID (e.g., QP001)
- `courseId` (Foreign Key): Associated course
- `subjectId` (Foreign Key): Subject
- `batchId` (Foreign Key): Target batch
- `createdBy` (Foreign Key): Staff who created
- `title`: Question paper title
- `description`: Description
- `examDate`: Scheduled exam date
- `totalMarks`: Maximum marks
- `duration`: Exam duration (minutes)
- `fileUrl`: Uploaded file URL
- `questionSet`: JSON array of questions

**Relationships**:
- Belongs to Subject (subjectId)
- Belongs to Batch (batchId)
- Belongs to Staff (createdBy)
- Has many Exams

**Used For**: Exam preparation, question bank management

---

### 10. **exams** Table
**Purpose**: Schedules exams using question papers.

**Fields**:
- `examId` (Primary Key): Unique exam ID (e.g., EXM001)
- `courseId` (Foreign Key): Associated course
- `qpId` (Foreign Key): Question paper to use
- `batchId` (Foreign Key): Target batch
- `date`: Exam date
- `status`: scheduled/ongoing/completed/cancelled

**Relationships**:
- Belongs to Question Paper (qpId)
- Belongs to Batch (batchId)
- Has many Results

**Used For**: Exam scheduling, exam management

---

### 11. **results** Table
**Purpose**: Stores student exam results.

**Fields**:
- `resultId` (Primary Key): Unique result ID (e.g., RES001)
- `studentId` (Foreign Key): Student
- `examId` (Foreign Key): Exam
- `totalMarks`: Maximum marks
- `obtainedMarks`: Marks scored
- `percentage`: Calculated percentage
- `grade`: Grade (A/B/C/D/F)
- `remarks`: Additional comments

**Relationships**:
- Belongs to Student (studentId)
- Belongs to Exam (examId)

**Used For**: Result management, performance tracking, report cards

---

### 12. **attendance** Table
**Purpose**: Tracks daily student attendance.

**Fields**:
- `attendanceId` (Primary Key): Unique attendance ID (e.g., ATT001)
- `batchId` (Foreign Key): Batch
- `subjectId` (Foreign Key): Subject
- `date`: Attendance date
- `records`: JSON array of student attendance
  ```json
  [
    {"studentId": "STU001", "status": "Present"},
    {"studentId": "STU002", "status": "Absent"}
  ]
  ```
- `markedBy` (Foreign Key): Staff who marked

**Relationships**:
- Belongs to Batch (batchId)
- Belongs to Subject (subjectId)
- Belongs to Staff (markedBy)

**Used For**: Attendance tracking, attendance reports

---

### 13. **materials** Table
**Purpose**: Stores study materials uploaded by staff.

**Fields**:
- `materialId` (Primary Key): Unique material ID (e.g., MAT001)
- `subjectId` (Foreign Key): Subject
- `title`: Material title
- `description`: Description
- `fileUrl`: File URL
- `uploadedBy` (Foreign Key): Staff who uploaded

**Relationships**:
- Belongs to Subject (subjectId)
- Belongs to Staff (uploadedBy)

**Used For**: Study material distribution, resource management

---

### 14. **notifications** Table
**Purpose**: System-wide announcements and notifications.

**Fields**:
- `notificationId` (Primary Key): Unique notification ID (e.g., NOT001)
- `title`: Notification title
- `message`: Notification message
- `forRole`: Target role (admin/staff/student/all)
- `targetBatchIds`: JSON array of batch IDs
- `createdBy` (Foreign Key): User who created

**Relationships**:
- Belongs to User (createdBy)

**Used For**: Announcements, alerts, communication

---

## Step-by-Step Workflow

### PHASE 1: Initial Setup (Admin)

#### Step 1: System Installation
1. Install Node.js and MySQL
2. Clone the repository
3. Navigate to Backend folder
4. Run `npm install`
5. Create `.env` file with database credentials
6. Create MySQL database: `CREATE DATABASE neet_academy;`
7. Run `npm run seed` to create tables and seed data
8. Start backend: `npm run dev`
9. Navigate to Frontend folder
10. Run `npm install`
11. Create `.env` file with API URL
12. Start frontend: `npm run dev`

#### Step 2: Admin Login
1. Open browser: `http://localhost:3000`
2. Login with admin credentials:
   - Email: admin@neetacademy.com
   - Password: admin123
3. Admin dashboard loads

---

### PHASE 2: Course & Subject Setup (Admin)

#### Step 3: Create Courses
1. Navigate to **Courses** page
2. Click **"Add Course"** button
3. Fill form:
   - Course Name: "NEET Foundation Course"
   - Duration: "24 months"
   - Description: Course details
   - Fees: 150000
   - Eligibility: "10th pass"
4. Click **"Save"**
5. Course created with auto-generated courseId (C001)

**Database**: New record in `courses` table

#### Step 4: Create Subjects
1. Navigate to **Subjects** page
2. Click **"Add Subject"** button
3. Fill form:
   - Subject Name: "Physics"
   - Subject Code: "PHY101"
   - Assign Staff: (Select later)
4. Click **"Save"**
5. Repeat for Chemistry, Biology, etc.

**Database**: New records in `subjects` table

#### Step 5: Link Subjects to Course
1. Go to **Courses** page
2. Click **"Edit"** on created course
3. Select subjects from dropdown
4. Click **"Update"**

**Database**: Updates `subjectIds` JSON field in `courses` table

---

### PHASE 3: Staff Management (Admin)

#### Step 6: Create Staff Accounts
1. Navigate to **Staff** page
2. Click **"Add Staff"** button
3. Fill form:
   - Name: "Dr. Priya Sharma"
   - Email: "priya.sharma@neetacademy.com"
   - Password: "staff123"
   - Phone: "9876543210"
   - Qualification: "M.Sc Physics, B.Ed"
   - Experience: "10 years"
   - Subject Expertise: Select subjects
   - Upload Profile Picture
4. Click **"Save"**

**Database**: 
- Creates record in `users` table (role: staff)
- Creates record in `staffs` table (linked via userId)

#### Step 7: Assign Subjects to Staff
1. Go to **Subjects** page
2. Click **"Edit"** on a subject
3. Select staff from dropdown
4. Click **"Update"**

**Database**: Updates `staffId` in `subjects` table

---

### PHASE 4: Batch Creation (Admin)

#### Step 8: Create Batches
1. Navigate to **Batches** page
2. Click **"Add Batch"** button
3. Fill form:
   - Batch Name: "Morning Batch A - 2024"
   - Course: Select course
   - Start Date: "2024-04-01"
   - End Date: "2026-03-31"
   - Assign Staff: Select multiple staff
4. Click **"Save"**

**Database**: New record in `batches` table with `staffIds` JSON array

---

### PHASE 5: Student Enrollment (Admin)

#### Step 9: Create Student Accounts
1. Navigate to **Students** page
2. Click **"Add Student"** button
3. Fill form:
   - Name: "Arun Patel"
   - Email: "arun.patel@student.neetacademy.com"
   - Password: "student123"
   - DOB: "2005-05-15"
   - Gender: "Male"
   - Address: Full address
   - Phone: "9876543211"
   - Roll No: "2024001"
   - Course: Select course
   - Batch: Select batch
   - Upload Profile Picture
4. Click **"Save"**

**Database**:
- Creates record in `users` table (role: student)
- Creates record in `students` table (linked via userId)
- Updates `studentIds` JSON in `batches` table

---

### PHASE 6: Timetable Creation (Admin/Staff)

#### Step 10: Create Weekly Timetable
1. Navigate to **Timetables** page
2. Click **"Add Timetable"** button
3. Select batch
4. Select week start date
5. For each day (Monday-Saturday):
   - Add time slots
   - Select subject
   - Select staff
   - Enter room number
   - Set start/end time
6. Click **"Save"**

**Database**: New record in `timetables` table with `schedule` JSON array

---

### PHASE 7: Daily Operations (Staff)

#### Step 11: Mark Attendance
1. Staff logs in
2. Navigate to **Attendance** page
3. Select:
   - Batch
   - Subject
   - Date
4. Student list appears
5. Mark each student as Present/Absent/Late
6. Click **"Submit Attendance"**

**Database**: New record in `attendance` table with `records` JSON array

#### Step 12: Upload Study Materials
1. Navigate to **Study Materials** page
2. Click **"Upload Material"** button
3. Fill form:
   - Subject: Select subject
   - Title: "Newton's Laws Notes"
   - Description: Material description
   - Upload File: Select PDF/DOC/PPT
4. Click **"Upload"**

**Database**: New record in `materials` table, file saved in `uploads/materials/`

#### Step 13: Create Question Papers
1. Navigate to **Question Papers** page
2. Click **"Create Question Paper"** button
3. Fill form:
   - Title: "Physics Unit Test 1"
   - Subject: Select subject
   - Batch: Select batch
   - Exam Date: Select date
   - Total Marks: 100
   - Duration: 180 minutes
   - Upload PDF or Create Questions Online
4. Click **"Save"**

**Database**: New record in `questionpapers` table

---

### PHASE 8: Exam Management (Admin)

#### Step 14: Schedule Exam
1. Navigate to **Exams** page
2. Click **"Schedule Exam"** button
3. Fill form:
   - Course: Select course
   - Question Paper: Select from created papers
   - Batch: Select batch
   - Date: Select exam date
4. Click **"Schedule"**

**Database**: New record in `exams` table (status: scheduled)

#### Step 15: Update Exam Status
1. On exam day, change status to "ongoing"
2. After exam, change status to "completed"

**Database**: Updates `status` field in `exams` table

---

### PHASE 9: Result Management (Staff)

#### Step 16: Enter Results
1. Navigate to **Results** page
2. Click **"Add Result"** button
3. Select exam
4. For each student:
   - Enter obtained marks
   - System calculates percentage
   - System assigns grade
   - Add remarks (optional)
5. Click **"Save Results"**

**Database**: New records in `results` table for each student

---

### PHASE 10: Communication (Admin/Staff)

#### Step 17: Send Notifications
1. Navigate to **Notifications** page
2. Click **"Create Notification"** button
3. Fill form:
   - Title: "Exam Schedule Update"
   - Message: Notification content
   - Target Role: Select (student/staff/all)
   - Target Batches: Select specific batches
4. Click **"Send"**

**Database**: New record in `notifications` table

---

### PHASE 11: Student Portal (Student)

#### Step 18: Student Login & Dashboard
1. Student logs in with credentials
2. Dashboard shows:
   - Upcoming exams
   - Attendance percentage
   - Recent results
   - Notifications

#### Step 19: View Timetable
1. Navigate to **Timetable** page
2. View weekly schedule for their batch

#### Step 20: View Results
1. Navigate to **Results** page
2. View all exam results with grades

#### Step 21: Download Study Materials
1. Navigate to **Study Materials** page
2. Filter by subject
3. Click download button

#### Step 22: Check Attendance
1. Navigate to **Attendance** page
2. View attendance records
3. See attendance percentage

---

## CRUD Operations Guide

### CREATE Operations

#### Create User (Admin Only)
**Endpoint**: POST `/api/users`
**Process**:
1. Admin fills user form
2. Frontend sends POST request with user data
3. Backend validates data
4. Password is hashed using bcrypt
5. Auto-generates userId (U001, U002...)
6. Inserts into `users` table
7. Returns success response

#### Create Student (Admin Only)
**Endpoint**: POST `/api/students`
**Process**:
1. Admin fills student form with profile picture
2. Frontend sends multipart/form-data
3. Backend validates data
4. Uploads profile picture to `uploads/students/`
5. Creates user account first (in `users` table)
6. Auto-generates studentId (STU001, STU002...)
7. Inserts into `students` table with userId reference
8. Updates batch's `studentIds` JSON array
9. Returns success response

#### Create Course (Admin Only)
**Endpoint**: POST `/api/courses`
**Process**:
1. Admin fills course form
2. Frontend sends JSON data
3. Backend validates data
4. Auto-generates courseId (C001, C002...)
5. Stores `subjectIds` as JSON array
6. Inserts into `courses` table
7. Returns success response

#### Create Attendance (Staff Only)
**Endpoint**: POST `/api/attendance`
**Process**:
1. Staff selects batch, subject, date
2. Marks each student's attendance
3. Frontend sends JSON with records array
4. Backend validates data
5. Auto-generates attendanceId (ATT001...)
6. Stores `records` as JSON array
7. Inserts into `attendance` table
8. Returns success response

---

### READ Operations

#### Get All Students (Admin/Staff)
**Endpoint**: GET `/api/students?page=1&limit=10&batchId=B001&status=active`
**Process**:
1. User navigates to Students page
2. Frontend sends GET request with filters
3. Backend queries `students` table with JOIN on `users`, `batches`, `courses`
4. Applies pagination and filters
5. Returns array of students with related data
6. Frontend displays in table format

#### Get Student by ID (Admin/Staff/Student)
**Endpoint**: GET `/api/students/STU001`
**Process**:
1. User clicks on student name
2. Frontend sends GET request with studentId
3. Backend queries `students` table with JOINs
4. Returns single student object with:
   - User details
   - Batch details
   - Course details
   - Results
5. Frontend displays in detail view

#### Get Dashboard Data (All Roles)
**Endpoint**: GET `/api/dashboard/admin` or `/staff` or `/student`
**Process**:
1. User logs in
2. Frontend sends GET request based on role
3. Backend aggregates data:
   - **Admin**: Total students, staff, courses, batches, recent activities
   - **Staff**: Assigned batches, subjects, upcoming exams, attendance stats
   - **Student**: Attendance %, upcoming exams, recent results, notifications
4. Returns dashboard statistics
5. Frontend displays cards and charts

---

### UPDATE Operations

#### Update Student (Admin Only)
**Endpoint**: PUT `/api/students/STU001`
**Process**:
1. Admin clicks "Edit" button
2. Form pre-fills with existing data
3. Admin modifies fields
4. Frontend sends PUT request with updated data
5. Backend validates data
6. If profile picture changed, uploads new file
7. Updates record in `students` table
8. If batch changed, updates `studentIds` in old and new batches
9. Returns success response

#### Update Exam Status (Admin)
**Endpoint**: PUT `/api/exams/EXM001`
**Process**:
1. Admin changes exam status dropdown
2. Frontend sends PUT request
3. Backend updates `status` field in `exams` table
4. Returns success response

#### Update Subject Assignment (Admin)
**Endpoint**: PUT `/api/subjects/SUB001`
**Process**:
1. Admin selects new staff for subject
2. Frontend sends PUT request
3. Backend updates `staffId` in `subjects` table
4. Updates `subjectExpertise` JSON in `staffs` table
5. Returns success response

---

### DELETE Operations

#### Delete Student (Admin Only)
**Endpoint**: DELETE `/api/students/STU001`
**Process**:
1. Admin clicks "Delete" button
2. Confirmation dialog appears
3. Frontend sends DELETE request
4. Backend checks for dependencies:
   - Has results? (Cannot delete)
   - Has attendance records? (Cannot delete)
5. If no dependencies:
   - Deletes from `students` table
   - Deletes from `users` table
   - Removes from batch's `studentIds`
   - Deletes profile picture file
6. Returns success response

#### Soft Delete (Status Change)
**Alternative**: Instead of deleting, change `status` to 'inactive'
**Process**:
1. Admin clicks "Deactivate"
2. Frontend sends PUT request
3. Backend updates `status` field
4. Record remains in database but hidden from active lists

---

## User Roles & Permissions

### Admin Role
**Can Do**:
- Create/Edit/Delete: Users, Students, Staff, Courses, Subjects, Batches, Classes
- Schedule Exams
- View all data
- Send notifications
- Generate reports
- Manage system settings

**Cannot Do**:
- Mark attendance (Staff only)
- Upload materials (Staff only)
- Create question papers (Staff only)

### Staff Role
**Can Do**:
- View: Students, Batches, Courses, Subjects (assigned)
- Mark attendance
- Upload study materials
- Create question papers
- Enter results
- View timetables
- Send notifications to students

**Cannot Do**:
- Create/Delete users
- Create courses/batches
- Delete any records
- Access admin settings

### Student Role
**Can Do**:
- View own profile
- View timetable
- View attendance
- View results
- Download study materials
- View notifications
- View exam schedule

**Cannot Do**:
- Create/Edit/Delete anything
- View other students' data
- Access admin/staff features

---

## Complete Data Flow Example

### Example: Student Enrollment to Result Publication

**Step 1**: Admin creates course "NEET 2024"
- `courses` table: C001 created

**Step 2**: Admin creates subjects (Physics, Chemistry, Biology)
- `subjects` table: SUB001, SUB002, SUB003 created

**Step 3**: Admin creates staff accounts
- `users` table: U002 (role: staff) created
- `staffs` table: STF001 created

**Step 4**: Admin assigns Physics to Dr. Sharma
- `subjects` table: SUB001.staffId = STF001

**Step 5**: Admin creates batch "Morning Batch A"
- `batches` table: B001 created with courseId=C001

**Step 6**: Admin enrolls student Arun
- `users` table: U003 (role: student) created
- `students` table: STU001 created with batchId=B001, courseId=C001
- `batches` table: B001.studentIds updated to ["STU001"]

**Step 7**: Admin creates timetable
- `timetables` table: TT001 created with schedule JSON

**Step 8**: Staff marks attendance daily
- `attendance` table: ATT001, ATT002... created with records JSON

**Step 9**: Staff creates question paper
- `questionpapers` table: QP001 created

**Step 10**: Admin schedules exam
- `exams` table: EXM001 created with qpId=QP001, batchId=B001

**Step 11**: Exam conducted, status updated to "completed"
- `exams` table: EXM001.status = "completed"

**Step 12**: Staff enters results
- `results` table: RES001 created with studentId=STU001, examId=EXM001

**Step 13**: Student logs in and views result
- Frontend queries `/api/results?studentId=STU001`
- Backend JOINs `results` → `exams` → `questionpapers` → `subjects`
- Returns complete result with subject name, marks, grade

---

## File Upload Workflow

### Profile Picture Upload
1. User selects image file
2. Frontend validates file (size, type)
3. Creates FormData object
4. Sends POST/PUT request with multipart/form-data
5. Backend multer middleware processes upload
6. File saved to `uploads/students/` or `uploads/staff/`
7. Filename stored in database
8. Frontend displays uploaded image

### Study Material Upload
1. Staff selects PDF/DOC/PPT file
2. Frontend validates file
3. Creates FormData with subject, title, description, file
4. Sends POST request
5. Backend saves to `uploads/materials/`
6. Creates record in `materials` table with fileUrl
7. Students can download via `/uploads/materials/filename.pdf`

---

## Authentication Flow

1. User enters email/password
2. Frontend sends POST `/api/auth/login`
3. Backend queries `users` table
4. Compares password using bcrypt
5. If valid, generates JWT token (expires in 7 days)
6. Returns token + user data
7. Frontend stores token in localStorage
8. All subsequent requests include: `Authorization: Bearer <token>`
9. Backend middleware verifies token
10. Extracts userId and role from token
11. Allows/denies access based on role

---

## Summary

This system follows a hierarchical workflow:
1. **Setup**: Courses → Subjects → Staff
2. **Organization**: Batches → Students → Classes
3. **Planning**: Timetables → Question Papers
4. **Operations**: Attendance → Exams → Results
5. **Communication**: Notifications → Materials

Each table serves a specific purpose and connects through foreign keys and JSON arrays to create a complete educational management ecosystem.
