// const { Student, User, Batch, Course } = require('../models');
// const generateIds = require('../utils/generateId');
// const { sendSuccess, sendError } = require('../utils/response');

// const createStudent = async (req, res) => {
//   try {
//     const { name, email, password, dob, gender, address, phone, batchId, courseId, rollNo } = req.body;

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return sendError(res, 400, 'User already exists with this email');
//     }

//     const userId = generateIds.user();
//     const studentId = generateIds.student();

//     const user = await User.create({
//       userId,
//       name,
//       email,
//       password,
//       role: 'student'
//     });

//     const student = await Student.create({
//       studentId,
//       userId,
//       name,
//       dob,
//       gender,
//       address,
//       phone,
//       email,
//       batchId,
//       courseId,
//       rollNo,
//       profilePic: req.file ? req.file.path : null
//     });

//     sendSuccess(res, 'Student created successfully', student, 201);
//   } catch (error) {
//     sendError(res, 500, 'Failed to create student', error);
//   }
// };

// const getAllStudents = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, batchId, courseId, status } = req.query;
    
//     const where = {};
//     if (batchId) where.batchId = batchId;
//     if (courseId) where.courseId = courseId;
//     if (status) where.status = status;

//     const students = await Student.findAndCountAll({
//       where,
//       include: [
//         { model: User, as: 'user', attributes: ['name', 'email'] },
//         { model: Batch, as: 'batch', attributes: ['batchName'] },
//         { model: Course, as: 'course', attributes: ['courseName'] }
//       ],
//       limit: parseInt(limit),
//       offset: (parseInt(page) - 1) * parseInt(limit),
//       order: [['createdAt', 'DESC']]
//     });

//     sendSuccess(res, 'Students retrieved successfully', {
//       students: students.rows,
//       totalCount: students.count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(students.count / parseInt(limit))
//     });
//   } catch (error) {
//     sendError(res, 500, 'Failed to get students', error);
//   }
// };

// const getStudentById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const student = await Student.findByPk(id, {
//       include: [
//         { model: User, as: 'user' },
//         { model: Batch, as: 'batch' },
//         { model: Course, as: 'course' }
//       ]
//     });

//     if (!student) {
//       return sendError(res, 404, 'Student not found');
//     }

//     sendSuccess(res, 'Student retrieved successfully', student);
//   } catch (error) {
//     sendError(res, 500, 'Failed to get student', error);
//   }
// };

// const updateStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     if (req.file) {
//       updateData.profilePic = req.file.path;
//     }

//     const [updatedRowsCount] = await Student.update(updateData, {
//       where: { studentId: id }
//     });

//     if (updatedRowsCount === 0) {
//       return sendError(res, 404, 'Student not found');
//     }

//     const updatedStudent = await Student.findByPk(id);
//     sendSuccess(res, 'Student updated successfully', updatedStudent);
//   } catch (error) {
//     sendError(res, 500, 'Failed to update student', error);
//   }
// };

// const deleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const student = await Student.findByPk(id);
//     if (!student) {
//       return sendError(res, 404, 'Student not found');
//     }

//     await User.destroy({ where: { userId: student.userId } });
//     await Student.destroy({ where: { studentId: id } });

//     sendSuccess(res, 'Student deleted successfully');
//   } catch (error) {
//     sendError(res, 500, 'Failed to delete student', error);
//   }
// };

// module.exports = {
//   createStudent,
//   getAllStudents,
//   getStudentById,
//   updateStudent,
//   deleteStudent
// };

const { Student, User, Batch, Course } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');
 
const createStudent = async (req, res) => {
  try {
    const { userId: existingUserId, name, email, password, dob, gender, address, phone, batchId, courseId, rollNo, status,avatar } = req.body;
 
    let userId = existingUserId;
    const studentStatus = status !== undefined ? Boolean(status) : true;

    // If userId not provided, create new user
    if (!userId) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return sendError(res, 400, 'User already exists with this email');
      }
 
      userId = generateIds.user();
      await User.create({
        userId,
        name,
        email,
        password,
        role: 'student'
      });
    }
 
    const studentId = generateIds.student();
    const student = await Student.create({
      studentId,
      userId,
      name,
      dob,
      gender,
      address,
      phone,
      email,
      batchId: batchId || null,
      courseId: courseId || null,
      rollNo,
      profilePic: avatar || (req.file ? req.file.path : null),
      status: studentStatus
    });
 
    sendSuccess(res, 'Student created successfully', student, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create student', error);
  }
};
 
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, batchId, courseId, status } = req.query;
   
    const where = {};
    if (batchId) where.batchId = batchId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;
 
    const students = await Student.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Batch, as: 'batch', attributes: ['batchName'] },
        { model: Course, as: 'course', attributes: ['courseName'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
 
    sendSuccess(res, 'Students retrieved successfully', {
      students: students.rows,
      totalCount: students.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(students.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get students', error);
  }
};
 
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
   
    const student = await Student.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Batch, as: 'batch' },
        { model: Course, as: 'course' }
      ]
    });
 
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }
 
    // Format response with profile picture URL
    const studentData = student.toJSON();
    if (studentData.profilePic) {
      studentData.profilePicUrl = `${req.protocol}://${req.get('host')}/${studentData.profilePic.replace(/\\/g, '/')}`;
    }
 
    sendSuccess(res, 'Student retrieved successfully', studentData);
  } catch (error) {
    sendError(res, 500, 'Failed to get student', error);
  }
};
 
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
 

    const { avatar } = req.body;
    
    // Handle profilePic from avatar field
    if (avatar && typeof avatar === 'string') {
      updateData.profilePic = avatar;
    } else if (req.file) {
      updateData.profilePic = req.file.path;
    }
   
  
  
    const [updatedRowsCount] = await Student.update(updateData, {
      where: { studentId: id }
    });
 
    if (updatedRowsCount === 0) {
      return sendError(res, 404, 'Student not found');
    }
 
    const updatedStudent = await Student.findByPk(id);
    sendSuccess(res, 'Student updated successfully', updatedStudent);
  } catch (error) {
    sendError(res, 500, 'Failed to update student', error);
  }
};
 
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
 
    const student = await Student.findByPk(id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }
 
    await User.destroy({ where: { userId: student.userId } });
    await Student.destroy({ where: { studentId: id } });
 
    sendSuccess(res, 'Student deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete student', error);
  }
};
 
// const toggleStudentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
   
//     const student = await Student.findByPk(id);
//     if (!student) {
//       return sendError(res, 404, 'Student not found');
//     }
 
//     const newStatus = student.status === 1 ? 0 : 1;
//     await Student.update({ status: newStatus }, { where: { studentId: id } });
 
//     const updatedStudent = await Student.findByPk(id);
//     sendSuccess(res, `Student ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, updatedStudent);
//   } catch (error) {
//     sendError(res, 500, 'Failed to toggle student status', error);
//   }
// };
 
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
 
};
 