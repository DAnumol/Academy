// const bcrypt = require('bcryptjs');
// const db = require('../models');

// const seedData = async () => {
//   try {
//     console.log('🌱 Starting database seeding...');

//     // Clear existing data
//     await db.sequelize.sync({ force: true });

//     // Users
//     const users = [
//       {
//         userId: 'U001',
//         name: 'Rajesh Kumar',
//         email: 'admin@neetacademy.com',
//         password: '$2b$10$hashedpassword123',
//         role: 'admin'
//       },
//       {
//         userId: 'U002',
//         name: 'Dr. Priya Sharma',
//         email: 'priya.sharma@neetacademy.com',
//         password: '$2b$10$hashedpassword456',
//         role: 'staff'
//       },
//       {
//         userId: 'U003',
//         name: 'Arun Patel',
//         email: 'arun.patel@student.neetacademy.com',
//         password: '$2b$10$hashedpassword789',
//         role: 'student'
//       },
//       {
//         userId: 'U004',
//         name: 'Dr. Vikram Singh',
//         email: 'vikram.singh@neetacademy.com',
//         password: '$2b$10$hashedpasswordabc',
//         role: 'staff'
//       },
//       {
//         userId: 'U005',
//         name: 'Sneha Reddy',
//         email: 'sneha.reddy@student.neetacademy.com',
//         password: '$2b$10$hashedpassworddef',
//         role: 'student'
//       },
//       {
//         userId: 'U006',
//         name: 'Rahul Sharma',
//         email: 'rahul.sharma@student.neetacademy.com',
//         password: '$2b$10$hashedpasswordghi',
//         role: 'student'
//       },
//       {
//         userId: 'U007',
//         name: 'Dr. Anita Desai',
//         email: 'anita.desai@neetacademy.com',
//         password: '$2b$10$hashedpasswordjkl',
//         role: 'staff'
//       }
//     ];

//     await db.User.bulkCreate(users);
//     console.log('✅ Users seeded');

//     // Courses
//     const courses = [
//       {
//         courseId: 'C001',
//         courseName: 'NEET Foundation Course',
//         duration: '24 months',
//         description: 'Comprehensive preparation for NEET examination covering Physics, Chemistry, and Biology',
//         fees: 150000,
//         subjectIds: ['SUB001', 'SUB002', 'SUB003', 'SUB004', 'SUB005'],
//         status: 'active',
//         createdBy: 'U001'
//       },
//       {
//         courseId: 'C002',
//         courseName: 'NEET Crash Course',
//         duration: '6 months',
//         description: 'Intensive revision and test preparation for NEET',
//         fees: 50000,
//         subjectIds: ['SUB001', 'SUB002', 'SUB003'],
//         status: 'active',
//         createdBy: 'U001'
//       }
//     ];

//     await db.Course.bulkCreate(courses);
//     console.log('✅ Courses seeded');

//     // Staff
//     const staffs = [
//       {
//         staffId: 'STF001',
//         userId: 'U002',
//         name: 'Dr. Priya Sharma',
//         subjectExpertise: ['Physics', 'Mathematics'],
//         phone: '+91-9123456789',
//         email: 'priya.sharma@neetacademy.com',
//         qualification: 'Ph.D. in Physics, IIT Delhi',
//         experience: '12 years',
//         assignedBatchIds: ['B001', 'B002'],
//         profilePic: '/uploads/staff/priya_sharma.jpg',
//         status: 'active'
//       },
//       {
//         staffId: 'STF002',
//         userId: 'U004',
//         name: 'Dr. Vikram Singh',
//         subjectExpertise: ['Chemistry', 'Organic Chemistry'],
//         phone: '+91-9123456790',
//         email: 'vikram.singh@neetacademy.com',
//         qualification: 'M.Sc. Chemistry, Ph.D., University of Mumbai',
//         experience: '15 years',
//         assignedBatchIds: ['B001', 'B003'],
//         profilePic: '/uploads/staff/vikram_singh.jpg',
//         status: 'active'
//       },
//       {
//         staffId: 'STF003',
//         userId: 'U007',
//         name: 'Dr. Anita Desai',
//         subjectExpertise: ['Biology', 'Zoology', 'Botany'],
//         phone: '+91-9123456791',
//         email: 'anita.desai@neetacademy.com',
//         qualification: 'MBBS, MD, AIIMS Delhi',
//         experience: '10 years',
//         assignedBatchIds: ['B001', 'B002', 'B003'],
//         profilePic: '/uploads/staff/anita_desai.jpg',
//         status: 'active'
//       }
//     ];

//     await db.Staff.bulkCreate(staffs);
//     console.log('✅ Staff seeded');

//     // Subjects
//     const subjects = [
//       {
//         subjectId: 'SUB001',
//         name: 'Physics',
//         code: 'PHY101',
//         staffId: 'STF001'
//       },
//       {
//         subjectId: 'SUB002',
//         name: 'Chemistry',
//         code: 'CHM101',
//         staffId: 'STF002'
//       },
//       {
//         subjectId: 'SUB003',
//         name: 'Biology',
//         code: 'BIO101',
//         staffId: 'STF003'
//       },
//       {
//         subjectId: 'SUB004',
//         name: 'Zoology',
//         code: 'ZOO101',
//         staffId: 'STF003'
//       },
//       {
//         subjectId: 'SUB005',
//         name: 'Botany',
//         code: 'BOT101',
//         staffId: 'STF003'
//       }
//     ];

//     await db.Subject.bulkCreate(subjects);
//     console.log('✅ Subjects seeded');

//     // Batches
//     const batches = [
//       {
//         batchId: 'B001',
//         batchName: 'Morning Batch A - 2024',
//         courseId: 'C001',
//         staffIds: ['STF001', 'STF002', 'STF003'],
//         studentIds: ['STU001', 'STU002'],
//         startDate: '2024-04-01',
//         endDate: '2026-03-31',
//         status: 'active'
//       },
//       {
//         batchId: 'B002',
//         batchName: 'Evening Batch B - 2024',
//         courseId: 'C001',
//         staffIds: ['STF001', 'STF003'],
//         studentIds: ['STU003'],
//         startDate: '2024-04-01',
//         endDate: '2026-03-31',
//         status: 'active'
//       },
//       {
//         batchId: 'B003',
//         batchName: 'Crash Course Batch - 2024',
//         courseId: 'C002',
//         staffIds: ['STF002', 'STF003'],
//         studentIds: [],
//         startDate: '2024-10-01',
//         endDate: '2025-03-31',
//         status: 'active'
//       }
//     ];

//     await db.Batch.bulkCreate(batches);
//     console.log('✅ Batches seeded');

//     // Students
//     const students = [
//       {
//         studentId: 'STU001',
//         userId: 'U003',
//         name: 'Arun Patel',
//         dob: '2006-05-15',
//         gender: 'Male',
//         address: '123, MG Road, Bangalore, Karnataka - 560001',
//         phone: '+91-9876543210',
//         email: 'arun.patel@student.neetacademy.com',
//         batchId: 'B001',
//         courseId: 'C001',
//         rollNo: 'NEET2024001',
//         profilePic: '/uploads/students/arun_patel.jpg',
//         status: 'active'
//       },
//       {
//         studentId: 'STU002',
//         userId: 'U005',
//         name: 'Sneha Reddy',
//         dob: '2006-08-22',
//         gender: 'Female',
//         address: '456, Jubilee Hills, Hyderabad, Telangana - 500033',
//         phone: '+91-9876543211',
//         email: 'sneha.reddy@student.neetacademy.com',
//         batchId: 'B001',
//         courseId: 'C001',
//         rollNo: 'NEET2024002',
//         profilePic: '/uploads/students/sneha_reddy.jpg',
//         status: 'active'
//       },
//       {
//         studentId: 'STU003',
//         userId: 'U006',
//         name: 'Rahul Sharma',
//         dob: '2006-11-30',
//         gender: 'Male',
//         address: '789, Connaught Place, New Delhi - 110001',
//         phone: '+91-9876543212',
//         email: 'rahul.sharma@student.neetacademy.com',
//         batchId: 'B002',
//         courseId: 'C001',
//         rollNo: 'NEET2024003',
//         profilePic: '/uploads/students/rahul_sharma.jpg',
//         status: 'active'
//       }
//     ];

//     await db.Student.bulkCreate(students);
//     console.log('✅ Students seeded');

//     // Classes
//     const classes = [
//       {
//         classId: 'CLS001',
//         className: 'Physics Advanced',
//         batchId: 'B001',
//         staffIds: ['STF001'],
//         studentIds: ['STU001', 'STU002'],
//         subjectIds: ['SUB001'],
//         status: 'active'
//       },
//       {
//         classId: 'CLS002',
//         className: 'Chemistry Basics',
//         batchId: 'B001',
//         staffIds: ['STF002'],
//         studentIds: ['STU001', 'STU002'],
//         subjectIds: ['SUB002'],
//         status: 'active'
//       },
//       {
//         classId: 'CLS003',
//         className: 'Biology Complete',
//         batchId: 'B001',
//         staffIds: ['STF003'],
//         studentIds: ['STU001', 'STU002'],
//         subjectIds: ['SUB003', 'SUB004', 'SUB005'],
//         status: 'active'
//       }
//     ];

//     await db.Class.bulkCreate(classes);
//     console.log('✅ Classes seeded');

//     // Timetables
//     const timetables = [
//       {
//         timetableId: 'TT001',
//         batchId: 'B001',
//         weekStartDate: '2024-11-04',
//         schedule: [
//           {
//             day: 'Monday',
//             subjectId: 'SUB001',
//             startTime: '08:00',
//             endTime: '10:00',
//             staffId: 'STF001',
//             roomNo: '101'
//           },
//           {
//             day: 'Monday',
//             subjectId: 'SUB002',
//             startTime: '10:30',
//             endTime: '12:30',
//             staffId: 'STF002',
//             roomNo: '102'
//           },
//           {
//             day: 'Tuesday',
//             subjectId: 'SUB003',
//             startTime: '08:00',
//             endTime: '10:00',
//             staffId: 'STF003',
//             roomNo: '103'
//           },
//           {
//             day: 'Tuesday',
//             subjectId: 'SUB001',
//             startTime: '10:30',
//             endTime: '12:30',
//             staffId: 'STF001',
//             roomNo: '101'
//           },
//           {
//             day: 'Wednesday',
//             subjectId: 'SUB002',
//             startTime: '08:00',
//             endTime: '10:00',
//             staffId: 'STF002',
//             roomNo: '102'
//           },
//           {
//             day: 'Thursday',
//             subjectId: 'SUB004',
//             startTime: '08:00',
//             endTime: '10:00',
//             staffId: 'STF003',
//             roomNo: '103'
//           },
//           {
//             day: 'Friday',
//             subjectId: 'SUB005',
//             startTime: '08:00',
//             endTime: '10:00',
//             staffId: 'STF003',
//             roomNo: '103'
//           }
//         ],
//         createdBy: 'U001'
//       }
//     ];

//     await db.Timetable.bulkCreate(timetables);
//     console.log('✅ Timetables seeded');

//     // Question Papers
//     const questionPapers = [
//       {
//         qpId: 'QP001',
//         subjectId: 'SUB001',
//         batchId: 'B001',
//         createdBy: 'STF001',
//         title: 'Physics - Unit Test 1: Mechanics',
//         description: 'Covers Newton\'s Laws, Work Energy, and Rotational Motion',
//         examDate: '2024-11-15',
//         totalMarks: 100,
//         duration: 180,
//         fileUrl: '/uploads/questionpapers/physics_unit1.pdf',
//         questionSet: [
//           {
//             questionText: 'A body of mass 2 kg is moving with a velocity of 10 m/s. What is its kinetic energy?',
//             options: ['50 J', '100 J', '200 J', '400 J'],
//             correctAnswer: 'B'
//           },
//           {
//             questionText: 'What is the SI unit of force?',
//             options: ['Joule', 'Newton', 'Watt', 'Pascal'],
//             correctAnswer: 'B'
//           },
//           {
//             questionText: 'The rate of change of angular momentum is equal to?',
//             options: ['Force', 'Torque', 'Work', 'Power'],
//             correctAnswer: 'B'
//           }
//         ]
//       },
//       {
//         qpId: 'QP002',
//         subjectId: 'SUB002',
//         batchId: 'B001',
//         createdBy: 'STF002',
//         title: 'Chemistry - Organic Chemistry Basics',
//         description: 'Nomenclature, Isomerism, and Reaction Mechanisms',
//         examDate: '2024-11-18',
//         totalMarks: 100,
//         duration: 180,
//         fileUrl: '/uploads/questionpapers/chemistry_organic.pdf',
//         questionSet: [
//           {
//             questionText: 'What is the IUPAC name of CH3-CH2-CH2-OH?',
//             options: ['Propanol', '1-Propanol', '2-Propanol', 'Propan-1-ol'],
//             correctAnswer: 'D'
//           },
//           {
//             questionText: 'Which of the following shows optical isomerism?',
//             options: ['Ethane', 'Propane', '2-Butanol', 'Methanol'],
//             correctAnswer: 'C'
//           }
//         ]
//       },
//       {
//         qpId: 'QP003',
//         subjectId: 'SUB003',
//         batchId: 'B001',
//         createdBy: 'STF003',
//         title: 'Biology - Cell Biology and Genetics',
//         description: 'Cell structure, DNA, and Mendelian inheritance',
//         examDate: '2024-11-20',
//         totalMarks: 100,
//         duration: 180,
//         fileUrl: '/uploads/questionpapers/biology_cell.pdf',
//         questionSet: [
//           {
//             questionText: 'What is the powerhouse of the cell?',
//             options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'],
//             correctAnswer: 'B'
//           },
//           {
//             questionText: 'DNA replication occurs during which phase?',
//             options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
//             correctAnswer: 'B'
//           }
//         ]
//       }
//     ];

//     await db.QuestionPaper.bulkCreate(questionPapers);
//     console.log('✅ Question Papers seeded');

//     // Attendance
//     const attendances = [
//       {
//         attendanceId: 'ATT001',
//         batchId: 'B001',
//         subjectId: 'SUB001',
//         date: '2024-11-04',
//         records: [
//           { studentId: 'STU001', status: 'Present' },
//           { studentId: 'STU002', status: 'Present' }
//         ],
//         markedBy: 'STF001'
//       },
//       {
//         attendanceId: 'ATT002',
//         batchId: 'B001',
//         subjectId: 'SUB002',
//         date: '2024-11-04',
//         records: [
//           { studentId: 'STU001', status: 'Present' },
//           { studentId: 'STU002', status: 'Absent' }
//         ],
//         markedBy: 'STF002'
//       },
//       {
//         attendanceId: 'ATT003',
//         batchId: 'B001',
//         subjectId: 'SUB003',
//         date: '2024-11-05',
//         records: [
//           { studentId: 'STU001', status: 'Present' },
//           { studentId: 'STU002', status: 'Present' }
//         ],
//         markedBy: 'STF003'
//       }
//     ];

//     await db.Attendance.bulkCreate(attendances);
//     console.log('✅ Attendance seeded');

//     // Study Materials
//     const materials = [
//       {
//         materialId: 'MAT001',
//         subjectId: 'SUB001',
//         title: 'Newton\'s Laws of Motion - Complete Notes',
//         description: 'Detailed notes covering all three laws with examples and practice problems',
//         fileUrl: '/uploads/materials/physics_newtons_laws.pdf',
//         uploadedBy: 'STF001'
//       },
//       {
//         materialId: 'MAT002',
//         subjectId: 'SUB002',
//         title: 'Organic Chemistry - Reaction Mechanisms',
//         description: 'Step-by-step guide to understanding organic reactions',
//         fileUrl: '/uploads/materials/chemistry_reactions.pdf',
//         uploadedBy: 'STF002'
//       }
//     ];

//     await db.Material.bulkCreate(materials);
//     console.log('✅ Materials seeded');

//     // Additional Materials
//     const additionalMaterials = [
//       {
//         materialId: 'MAT003',
//         subjectId: 'SUB001',
//         title: 'Work, Energy and Power - Video Lecture',
//         description: 'Complete video explanation with solved examples',
//         fileUrl: '/uploads/materials/physics_work_energy.mp4',
//         uploadedBy: 'STF001'
//       },
//       {
//         materialId: 'MAT004',
//         subjectId: 'SUB003',
//         title: 'Cell Structure and Functions - PPT',
//         description: 'Visual presentation on cell organelles and their functions',
//         fileUrl: '/uploads/materials/biology_cell_structure.pptx',
//         uploadedBy: 'STF003'
//       },
//       {
//         materialId: 'MAT005',
//         subjectId: 'SUB004',
//         title: 'Human Anatomy - Digestive System',
//         description: 'Detailed notes on digestive system with diagrams',
//         fileUrl: '/uploads/materials/zoology_digestive.pdf',
//         uploadedBy: 'STF003'
//       }
//     ];

//     await db.Material.bulkCreate(additionalMaterials);
//     console.log('✅ Additional Materials seeded');

//     // Exams
//     const exams = [
//       {
//         examId: 'EXM001',
//         qpId: 'QP001',
//         batchId: 'B001',
//         date: '2024-11-15',
//         status: 'scheduled'
//       },
//       {
//         examId: 'EXM002',
//         qpId: 'QP002',
//         batchId: 'B001',
//         date: '2024-11-18',
//         status: 'scheduled'
//       },
//       {
//         examId: 'EXM003',
//         qpId: 'QP001',
//         batchId: 'B002',
//         date: '2024-10-28',
//         status: 'completed'
//       }
//     ];

//     await db.Exam.bulkCreate(exams);
//     console.log('✅ Exams seeded');

//     // Results
//     const results = [
//       {
//         resultId: 'RES001',
//         studentId: 'STU003',
//         examId: 'EXM003',
//         totalMarks: 100,
//         obtainedMarks: 85,
//         percentage: 85.0,
//         grade: 'A',
//         remarks: 'Excellent performance. Strong conceptual understanding.'
//       },
//       {
//         resultId: 'RES002',
//         studentId: 'STU001',
//         examId: 'EXM003',
//         totalMarks: 100,
//         obtainedMarks: 72,
//         percentage: 72.0,
//         grade: 'B',
//         remarks: 'Good work. Focus more on numerical problems.'
//       },
//       {
//         resultId: 'RES003',
//         studentId: 'STU002',
//         examId: 'EXM003',
//         totalMarks: 100,
//         obtainedMarks: 91,
//         percentage: 91.0,
//         grade: 'A+',
//         remarks: 'Outstanding! Keep up the excellent work.'
//       }
//     ];

//     await db.Result.bulkCreate(results);
//     console.log('✅ Results seeded');

//     // Notifications
//     const notifications = [
//       {
//         notificationId: 'NOT001',
//         title: 'Physics Unit Test Scheduled',
//         message: 'Unit Test 1 for Physics (Mechanics) is scheduled on November 15, 2024 at 8:00 AM. Duration: 3 hours.',
//         forRole: 'student',
//         targetBatchIds: ['B001'],
//         createdBy: 'U002'
//       },
//       {
//         notificationId: 'NOT002',
//         title: 'New Study Material Uploaded',
//         message: 'Dr. Priya Sharma has uploaded new notes on Work, Energy and Power. Check the Materials section.',
//         forRole: 'student',
//         targetBatchIds: ['B001', 'B002'],
//         createdBy: 'U002'
//       },
//       {
//         notificationId: 'NOT003',
//         title: 'Holiday Notice',
//         message: 'The academy will remain closed on November 12, 2024 for Diwali. Classes will resume on November 13.',
//         forRole: 'student',
//         targetBatchIds: ['B001', 'B002', 'B003'],
//         createdBy: 'U001'
//       },
//       {
//         notificationId: 'NOT004',
//         title: 'Parent-Teacher Meeting',
//         message: 'PTM scheduled for November 25, 2024. Please ensure attendance.',
//         forRole: 'staff',
//         createdBy: 'U001'
//       },
//       {
//         notificationId: 'NOT005',
//         title: 'Result Published',
//         message: 'Results for Physics Unit Test have been published. Check your dashboard.',
//         forRole: 'student',
//         targetBatchIds: ['B002'],
//         createdBy: 'U002'
//       }
//     ];

//     await db.Notification.bulkCreate(notifications);
//     console.log('✅ Notifications seeded');

//     console.log('🎉 Database seeding completed successfully!');
//     console.log('\n📋 Sample Login Credentials:');
//     console.log('Admin: admin@neetacademy.com / password');
//     console.log('Staff: priya.sharma@neetacademy.com / password');
//     console.log('Student: arun.patel@student.neetacademy.com / password');
//     console.log('\n📊 Data Summary:');
//     console.log('- Users: 7 (1 admin, 3 staff, 3 students)');
//     console.log('- Courses: 2');
//     console.log('- Subjects: 5');
//     console.log('- Batches: 3');
//     console.log('- Students: 3');
//     console.log('- Staff: 3');
//     console.log('- Classes: 3');
//     console.log('- Question Papers: 3');
//     console.log('- Exams: 3');
//     console.log('- Results: 3');
//     console.log('- Materials: 5');
//     console.log('- Attendance Records: 3');
//     console.log('- Notifications: 5');
//     console.log('- Timetables: 1');

//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//   }
// };

// module.exports = seedData;

// // Run seeder if called directly
// if (require.main === module) {
//   seedData().then(() => process.exit(0));
// }


const bcrypt = require('bcryptjs');
const db = require('../models');
 
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
 
    // Clear existing data
    await db.sequelize.sync({ force: true });
 
    // Hash passwords
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const staffPassword = await bcrypt.hash('staff123', saltRounds);
    const studentPassword = await bcrypt.hash('student123', saltRounds);
 
    // Users
    const users = [
      {
        userId: 'U001',
        name: 'Rajesh Kumar',
        email: 'admin@neetacademy.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        userId: 'U002',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@neetacademy.com',
        password: staffPassword,
        role: 'staff'
      },
      {
        userId: 'U003',
        name: 'Arun Patel',
        email: 'arun.patel@student.neetacademy.com',
        password: studentPassword,
        role: 'student'
      },
      {
        userId: 'U004',
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@neetacademy.com',
        password: staffPassword,
        role: 'staff'
      },
      {
        userId: 'U005',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@student.neetacademy.com',
        password: studentPassword,
        role: 'student'
      },
      {
        userId: 'U006',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@student.neetacademy.com',
        password: studentPassword,
        role: 'student'
      },
      {
        userId: 'U007',
        name: 'Dr. Anita Desai',
        email: 'anita.desai@neetacademy.com',
        password: staffPassword,
        role: 'staff'
      }
    ];
 
    await db.User.bulkCreate(users);
    console.log('✅ Users seeded');
 
    // Courses
    const courses = [
      {
        courseId: 'C001',
        courseName: 'NEET Foundation Course',
        duration: '24 months',
        description: 'Comprehensive preparation for NEET examination covering Physics, Chemistry, and Biology',
        fees: 150000,
        subjectIds: ['SUB001', 'SUB002', 'SUB003', 'SUB004', 'SUB005'],
        // status: 'active',
        createdBy: 'U001'
      },
      {
        courseId: 'C002',
        courseName: 'NEET Crash Course',
        duration: '6 months',
        description: 'Intensive revision and test preparation for NEET',
        fees: 50000,
        subjectIds: ['SUB001', 'SUB002', 'SUB003'],
        // status: 'active',
        createdBy: 'U001'
      }
    ];
 
    await db.Course.bulkCreate(courses);
    console.log('✅ Courses seeded');
 
    // Staff
    const staffs = [
      {
        staffId: 'STF001',
        userId: 'U002',
        name: 'Dr. Priya Sharma',
        subjectExpertise: ['Physics', 'Mathematics'],
        phone: '+91-9123456789',
        email: 'priya.sharma@neetacademy.com',
        qualification: 'Ph.D. in Physics, IIT Delhi',
        experience: '12 years',
        assignedBatchIds: ['B001', 'B002'],
        profilePic: '/uploads/staff/priya_sharma.jpg',
        // status: 'active'
      },
      {
        staffId: 'STF002',
        userId: 'U004',
        name: 'Dr. Vikram Singh',
        subjectExpertise: ['Chemistry', 'Organic Chemistry'],
        phone: '+91-9123456790',
        email: 'vikram.singh@neetacademy.com',
        qualification: 'M.Sc. Chemistry, Ph.D., University of Mumbai',
        experience: '15 years',
        assignedBatchIds: ['B001', 'B003'],
        profilePic: '/uploads/staff/vikram_singh.jpg',
        // status: 'active'
      },
      {
        staffId: 'STF003',
        userId: 'U007',
        name: 'Dr. Anita Desai',
        subjectExpertise: ['Biology', 'Zoology', 'Botany'],
        phone: '+91-9123456791',
        email: 'anita.desai@neetacademy.com',
        qualification: 'MBBS, MD, AIIMS Delhi',
        experience: '10 years',
        assignedBatchIds: ['B001', 'B002', 'B003'],
        profilePic: '/uploads/staff/anita_desai.jpg',
        // status: 'active'
      }
    ];
 
    await db.Staff.bulkCreate(staffs);
    console.log('✅ Staff seeded');
 
    // Subjects
    const subjects = [
      {
        subjectId: 'SUB001',
        name: 'Physics',
        code: 'PHY101',
        staffId: 'STF001'
      },
      {
        subjectId: 'SUB002',
        name: 'Chemistry',
        code: 'CHM101',
        staffId: 'STF002'
      },
      {
        subjectId: 'SUB003',
        name: 'Biology',
        code: 'BIO101',
        staffId: 'STF003'
      },
      {
        subjectId: 'SUB004',
        name: 'Zoology',
        code: 'ZOO101',
        staffId: 'STF003'
      },
      {
        subjectId: 'SUB005',
        name: 'Botany',
        code: 'BOT101',
        staffId: 'STF003'
      }
    ];
 
    await db.Subject.bulkCreate(subjects);
    console.log('✅ Subjects seeded');
 
    // Batches
    const batches = [
      {
        batchId: 'B001',
        batchName: 'Morning Batch A - 2024',
        courseId: 'C001',
        staffIds: ['STF001', 'STF002', 'STF003'],
        studentIds: ['STU001', 'STU002'],
        startDate: '2024-04-01',
        endDate: '2026-03-31',
       
      },
      {
        batchId: 'B002',
        batchName: 'Evening Batch B - 2024',
        courseId: 'C001',
        staffIds: ['STF001', 'STF003'],
        studentIds: ['STU003'],
        startDate: '2024-04-01',
        endDate: '2026-03-31',
       
      },
      {
        batchId: 'B003',
        batchName: 'Crash Course Batch - 2024',
        courseId: 'C002',
        staffIds: ['STF002', 'STF003'],
        studentIds: [],
        startDate: '2024-10-01',
        endDate: '2025-03-31',
      
      }
    ];
 
    await db.Batch.bulkCreate(batches);
    console.log('✅ Batches seeded');
 
    // Students
    const students = [
      {
        studentId: 'STU001',
        userId: 'U003',
        name: 'Arun Patel',
        dob: '2006-05-15',
        gender: 'Male',
        address: '123, MG Road, Bangalore, Karnataka - 560001',
        phone: '+91-9876543210',
        email: 'arun.patel@student.neetacademy.com',
        batchId: 'B001',
        courseId: 'C001',
        rollNo: 'NEET2024001',
        profilePic: '/uploads/students/arun_patel.jpg',
        // status: 'active'
      },
      {
        studentId: 'STU002',
        userId: 'U005',
        name: 'Sneha Reddy',
        dob: '2006-08-22',
        gender: 'Female',
        address: '456, Jubilee Hills, Hyderabad, Telangana - 500033',
        phone: '+91-9876543211',
        email: 'sneha.reddy@student.neetacademy.com',
        batchId: 'B001',
        courseId: 'C001',
        rollNo: 'NEET2024002',
        profilePic: '/uploads/students/sneha_reddy.jpg',
        // status: 'active'
      },
      {
        studentId: 'STU003',
        userId: 'U006',
        name: 'Rahul Sharma',
        dob: '2006-11-30',
        gender: 'Male',
        address: '789, Connaught Place, New Delhi - 110001',
        phone: '+91-9876543212',
        email: 'rahul.sharma@student.neetacademy.com',
        batchId: 'B002',
        courseId: 'C001',
        rollNo: 'NEET2024003',
        profilePic: '/uploads/students/rahul_sharma.jpg',
        // status: 'active'
      }
    ];
 
    await db.Student.bulkCreate(students);
    console.log('✅ Students seeded');
 
    // Classes
    const classes = [
      {
        classId: 'CLS001',
        className: 'Physics Advanced',
        batchId: 'B001',
        staffIds: ['STF001'],
        studentIds: ['STU001', 'STU002'],
        subjectIds: ['SUB001'],
        // status: 'active'
      },
      {
        classId: 'CLS002',
        className: 'Chemistry Basics',
        batchId: 'B001',
        staffIds: ['STF002'],
        studentIds: ['STU001', 'STU002'],
        subjectIds: ['SUB002'],
        // status: 'active'
      },
      {
        classId: 'CLS003',
        className: 'Biology Complete',
        batchId: 'B001',
        staffIds: ['STF003'],
        studentIds: ['STU001', 'STU002'],
        subjectIds: ['SUB003', 'SUB004', 'SUB005'],
        // status: 'active'
      }
    ];
 
    await db.Class.bulkCreate(classes);
    console.log('✅ Classes seeded');
 
    // Timetables
    const timetables = [
      {
        timetableId: 'TT001',
        batchId: 'B001',
        weekStartDate: '2024-11-04',
        schedule: [
          {
            day: 'Monday',
            subjectId: 'SUB001',
            startTime: '08:00',
            endTime: '10:00',
            staffId: 'STF001',
            roomNo: '101'
          },
          {
            day: 'Monday',
            subjectId: 'SUB002',
            startTime: '10:30',
            endTime: '12:30',
            staffId: 'STF002',
            roomNo: '102'
          },
          {
            day: 'Tuesday',
            subjectId: 'SUB003',
            startTime: '08:00',
            endTime: '10:00',
            staffId: 'STF003',
            roomNo: '103'
          },
          {
            day: 'Tuesday',
            subjectId: 'SUB001',
            startTime: '10:30',
            endTime: '12:30',
            staffId: 'STF001',
            roomNo: '101'
          },
          {
            day: 'Wednesday',
            subjectId: 'SUB002',
            startTime: '08:00',
            endTime: '10:00',
            staffId: 'STF002',
            roomNo: '102'
          },
          {
            day: 'Thursday',
            subjectId: 'SUB004',
            startTime: '08:00',
            endTime: '10:00',
            staffId: 'STF003',
            roomNo: '103'
          },
          {
            day: 'Friday',
            subjectId: 'SUB005',
            startTime: '08:00',
            endTime: '10:00',
            staffId: 'STF003',
            roomNo: '103'
          }
        ],
        createdBy: 'U001'
      }
    ];
 
    await db.Timetable.bulkCreate(timetables);
    console.log('✅ Timetables seeded');
 
    // Question Papers
    const questionPapers = [
      {
        qpId: 'QP001',
        subjectId: 'SUB001',
        batchId: 'B001',
        createdBy: 'STF001',
        title: 'Physics - Unit Test 1: Mechanics',
        description: 'Covers Newton\'s Laws, Work Energy, and Rotational Motion',
        examDate: '2024-11-15',
        totalMarks: 100,
        duration: 180,
        fileUrl: '/uploads/questionpapers/physics_unit1.pdf',
        questionSet: [
          {
            questionText: 'A body of mass 2 kg is moving with a velocity of 10 m/s. What is its kinetic energy?',
            options: ['50 J', '100 J', '200 J', '400 J'],
            correctAnswer: 'B'
          },
          {
            questionText: 'What is the SI unit of force?',
            options: ['Joule', 'Newton', 'Watt', 'Pascal'],
            correctAnswer: 'B'
          },
          {
            questionText: 'The rate of change of angular momentum is equal to?',
            options: ['Force', 'Torque', 'Work', 'Power'],
            correctAnswer: 'B'
          }
        ]
      },
      {
        qpId: 'QP002',
        subjectId: 'SUB002',
        batchId: 'B001',
        createdBy: 'STF002',
        title: 'Chemistry - Organic Chemistry Basics',
        description: 'Nomenclature, Isomerism, and Reaction Mechanisms',
        examDate: '2024-11-18',
        totalMarks: 100,
        duration: 180,
        fileUrl: '/uploads/questionpapers/chemistry_organic.pdf',
        questionSet: [
          {
            questionText: 'What is the IUPAC name of CH3-CH2-CH2-OH?',
            options: ['Propanol', '1-Propanol', '2-Propanol', 'Propan-1-ol'],
            correctAnswer: 'D'
          },
          {
            questionText: 'Which of the following shows optical isomerism?',
            options: ['Ethane', 'Propane', '2-Butanol', 'Methanol'],
            correctAnswer: 'C'
          }
        ]
      },
      {
        qpId: 'QP003',
        subjectId: 'SUB003',
        batchId: 'B001',
        createdBy: 'STF003',
        title: 'Biology - Cell Biology and Genetics',
        description: 'Cell structure, DNA, and Mendelian inheritance',
        examDate: '2024-11-20',
        totalMarks: 100,
        duration: 180,
        fileUrl: '/uploads/questionpapers/biology_cell.pdf',
        questionSet: [
          {
            questionText: 'What is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'],
            correctAnswer: 'B'
          },
          {
            questionText: 'DNA replication occurs during which phase?',
            options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
            correctAnswer: 'B'
          }
        ]
      }
    ];
 
    await db.QuestionPaper.bulkCreate(questionPapers);
    console.log('✅ Question Papers seeded');
 
    // Attendance
    const attendances = [
      {
        attendanceId: 'ATT001',
        batchId: 'B001',
        subjectId: 'SUB001',
        date: '2024-11-04',
        records: [
          { studentId: 'STU001', status: 'Present' },
          { studentId: 'STU002', status: 'Present' }
        ],
        markedBy: 'STF001'
      },
      {
        attendanceId: 'ATT002',
        batchId: 'B001',
        subjectId: 'SUB002',
        date: '2024-11-04',
        records: [
          { studentId: 'STU001', status: 'Present' },
          { studentId: 'STU002', status: 'Absent' }
        ],
        markedBy: 'STF002'
      },
      {
        attendanceId: 'ATT003',
        batchId: 'B001',
        subjectId: 'SUB003',
        date: '2024-11-05',
        records: [
          { studentId: 'STU001', status: 'Present' },
          { studentId: 'STU002', status: 'Present' }
        ],
        markedBy: 'STF003'
      }
    ];
 
    await db.Attendance.bulkCreate(attendances);
    console.log('✅ Attendance seeded');
 
    // Study Materials
    const materials = [
      {
        materialId: 'MAT001',
        subjectId: 'SUB001',
        title: 'Newton\'s Laws of Motion - Complete Notes',
        description: 'Detailed notes covering all three laws with examples and practice problems',
        fileUrl: '/uploads/materials/physics_newtons_laws.pdf',
        uploadedBy: 'STF001'
      },
      {
        materialId: 'MAT002',
        subjectId: 'SUB002',
        title: 'Organic Chemistry - Reaction Mechanisms',
        description: 'Step-by-step guide to understanding organic reactions',
        fileUrl: '/uploads/materials/chemistry_reactions.pdf',
        uploadedBy: 'STF002'
      }
    ];
 
    await db.Material.bulkCreate(materials);
    console.log('✅ Materials seeded');
 
    // Additional Materials
    const additionalMaterials = [
      {
        materialId: 'MAT003',
        subjectId: 'SUB001',
        title: 'Work, Energy and Power - Video Lecture',
        description: 'Complete video explanation with solved examples',
        fileUrl: '/uploads/materials/physics_work_energy.mp4',
        uploadedBy: 'STF001'
      },
      {
        materialId: 'MAT004',
        subjectId: 'SUB003',
        title: 'Cell Structure and Functions - PPT',
        description: 'Visual presentation on cell organelles and their functions',
        fileUrl: '/uploads/materials/biology_cell_structure.pptx',
        uploadedBy: 'STF003'
      },
      {
        materialId: 'MAT005',
        subjectId: 'SUB004',
        title: 'Human Anatomy - Digestive System',
        description: 'Detailed notes on digestive system with diagrams',
        fileUrl: '/uploads/materials/zoology_digestive.pdf',
        uploadedBy: 'STF003'
      }
    ];
 
    await db.Material.bulkCreate(additionalMaterials);
    console.log('✅ Additional Materials seeded');
 
    // Exams
    const exams = [
      {
        examId: 'EXM001',
        qpId: 'QP001',
        batchId: 'B001',
        date: '2024-11-15',
        status: 'scheduled'
      },
      {
        examId: 'EXM002',
        qpId: 'QP002',
        batchId: 'B001',
        date: '2024-11-18',
        status: 'scheduled'
      },
      {
        examId: 'EXM003',
        qpId: 'QP001',
        batchId: 'B002',
        date: '2024-10-28',
        status: 'completed'
      }
    ];
 
    await db.Exam.bulkCreate(exams);
    console.log('✅ Exams seeded');
 
    // Results
    const results = [
      {
        resultId: 'RES001',
        studentId: 'STU003',
        examId: 'EXM003',
        totalMarks: 100,
        obtainedMarks: 85,
        percentage: 85.0,
        grade: 'A',
        remarks: 'Excellent performance. Strong conceptual understanding.'
      },
      {
        resultId: 'RES002',
        studentId: 'STU001',
        examId: 'EXM003',
        totalMarks: 100,
        obtainedMarks: 72,
        percentage: 72.0,
        grade: 'B',
        remarks: 'Good work. Focus more on numerical problems.'
      },
      {
        resultId: 'RES003',
        studentId: 'STU002',
        examId: 'EXM003',
        totalMarks: 100,
        obtainedMarks: 91,
        percentage: 91.0,
        grade: 'A+',
        remarks: 'Outstanding! Keep up the excellent work.'
      }
    ];
 
    await db.Result.bulkCreate(results);
    console.log('✅ Results seeded');
 
    // Notifications
    const notifications = [
      {
        notificationId: 'NOT001',
        title: 'Physics Unit Test Scheduled',
        message: 'Unit Test 1 for Physics (Mechanics) is scheduled on November 15, 2024 at 8:00 AM. Duration: 3 hours.',
        forRole: 'student',
        targetBatchIds: ['B001'],
        createdBy: 'U002'
      },
      {
        notificationId: 'NOT002',
        title: 'New Study Material Uploaded',
        message: 'Dr. Priya Sharma has uploaded new notes on Work, Energy and Power. Check the Materials section.',
        forRole: 'student',
        targetBatchIds: ['B001', 'B002'],
        createdBy: 'U002'
      },
      {
        notificationId: 'NOT003',
        title: 'Holiday Notice',
        message: 'The academy will remain closed on November 12, 2024 for Diwali. Classes will resume on November 13.',
        forRole: 'student',
        targetBatchIds: ['B001', 'B002', 'B003'],
        createdBy: 'U001'
      },
      {
        notificationId: 'NOT004',
        title: 'Parent-Teacher Meeting',
        message: 'PTM scheduled for November 25, 2024. Please ensure attendance.',
        forRole: 'staff',
        createdBy: 'U001'
      },
      {
        notificationId: 'NOT005',
        title: 'Result Published',
        message: 'Results for Physics Unit Test have been published. Check your dashboard.',
        forRole: 'student',
        targetBatchIds: ['B002'],
        createdBy: 'U002'
      }
    ];
 
    await db.Notification.bulkCreate(notifications);
    console.log('✅ Notifications seeded');
 
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@neetacademy.com / password');
    console.log('Staff: priya.sharma@neetacademy.com / password');
    console.log('Student: arun.patel@student.neetacademy.com / password');
    console.log('\n📊 Data Summary:');
    console.log('- Users: 7 (1 admin, 3 staff, 3 students)');
    console.log('- Courses: 2');
    console.log('- Subjects: 5');
    console.log('- Batches: 3');
    console.log('- Students: 3');
    console.log('- Staff: 3');
    console.log('- Classes: 3');
    console.log('- Question Papers: 3');
    console.log('- Exams: 3');
    console.log('- Results: 3');
    console.log('- Materials: 5');
    console.log('- Attendance Records: 3');
    console.log('- Notifications: 5');
    console.log('- Timetables: 1');
 
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
 
module.exports = seedData;
 
// Run seeder if called directly
if (require.main === module) {
  seedData().then(() => process.exit(0));
}
 