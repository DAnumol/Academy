# NEET Academy Management System - Backend

A comprehensive backend system for managing NEET Academy operations including students, staff, courses, batches, timetables, exams, and results.

## 🚀 Features

- **User Management**: Admin, Staff, and Student roles with authentication
- **Student Management**: Complete student lifecycle management
- **Staff Management**: Faculty management with subject expertise
- **Course & Subject Management**: Comprehensive course structure
- **Batch Management**: Grouping students and staff
- **Timetable Management**: Weekly schedule management
- **Question Paper & Exam Management**: Online exam system
- **Attendance Tracking**: Digital attendance management
- **Study Materials**: File upload and management
- **Results & Analytics**: Performance tracking
- **Notifications**: System-wide announcements

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other configurations.

4. **Create MySQL database**
   ```sql
   CREATE DATABASE neet_academy;
   ```

5. **Run database migrations and seed data**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/profile` | Get user profile |

### Student Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/students` | Create student | Admin |
| GET | `/api/students` | Get all students | Admin, Staff |
| GET | `/api/students/:id` | Get student by ID | Admin, Staff, Student |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

### Course Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/courses` | Create course | Admin |
| GET | `/api/courses` | Get all courses | All |
| GET | `/api/courses/:id` | Get course by ID | All |
| PUT | `/api/courses/:id` | Update course | Admin |
| DELETE | `/api/courses/:id` | Delete course | Admin |

## 🔐 Sample Login Credentials

After running the seeder, you can use these credentials:

- **Admin**: admin@neetacademy.com / admin123
- **Staff**: priya.sharma@neetacademy.com / staff123
- **Student**: arun.patel@student.neetacademy.com / student123

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── studentController.js # Student management
│   └── courseController.js  # Course management
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── upload.js           # File upload middleware
├── models/
│   ├── index.js            # Database connection
│   ├── User.js             # User model
│   ├── Student.js          # Student model
│   ├── Staff.js            # Staff model
│   ├── Course.js           # Course model
│   └── ...                 # Other models
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── students.js         # Student routes
│   └── courses.js          # Course routes
├── seeders/
│   └── seedData.js         # Sample data seeder
├── utils/
│   ├── generateId.js       # ID generation utility
│   └── response.js         # Response utility
├── uploads/                # File upload directory
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json            # Dependencies
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## 📊 Database Schema

The system uses 14 main tables:
- users, students, staffs
- courses, subjects, batches, classes
- timetables, questionpapers, attendance
- materials, exams, results, notifications

## 🚀 Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@neetacademy.com or create an issue in the repository.