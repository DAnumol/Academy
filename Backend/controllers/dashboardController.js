const { User, Student, Staff, Course, Batch, Exam, Attendance, Result } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../utils/response');

const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.count({ where: { status: true } });
    const totalStaff = await Staff.count({ where: { status: true } });
    const totalCourses = await Course.count({ where: { status: true } });
    const totalBatches = await Batch.count({ where: { status: true } });
    const totalExams = await Exam.count({ where: { status: true } });
    
    const recentStudents = await Student.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['studentId', 'name', 'email', 'createdAt']
    });

    const stats = {
      totalStudents,
      totalStaff,
      totalCourses,
      totalBatches,
      totalExams,
      recentStudents
    };

    sendSuccess(res, 'Admin dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

const getStaffDashboard = async (req, res) => {
  try {
    const { userId } = req.user;
    const staff = await Staff.findOne({ where: { userId } });
    
    if (!staff) return sendError(res, 404, 'Staff not found');

    const totalStudents = await Student.count({ where: { status: true } });
    const totalBatches = await Batch.count({ where: { status: true } });
    const totalExams = await Exam.count({ where: { status: true } });
    const totalCourses = await Course.count({ where: { status: true } });

    const stats = {
      totalStudents,
      totalBatches,
      totalExams,
      totalCourses,
      staffName: staff.name
    };

    sendSuccess(res, 'Staff dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ where: { userId } });
    
    if (!student) return sendError(res, 404, 'Student not found');

    const { QuestionPaper, Material, Subject } = require('../models');

    const totalExams = await Exam.count({ 
      where: { batchId: student.batchId, status: true } 
    });

    const attemptedExams = await Result.count({
      where: { studentId: student.studentId }
    });

    const recentResults = await Result.findAll({
      where: { studentId: student.studentId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['resultId', 'obtainedMarks', 'totalMarks', 'percentage', 'grade', 'createdAt']
    });

    const upcomingExams = await Exam.findAll({
      where: { 
        batchId: student.batchId, 
        status: true,
        date: { [Op.gte]: new Date() }
      },
      limit: 5,
      order: [['date', 'ASC']],
      include: [{ model: QuestionPaper, as: 'questionPaper', attributes: ['title', 'totalMarks', 'duration'] }]
    });

    const latestMaterials = await Material.findAll({
      where: { status: true },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Subject, as: 'subject', attributes: ['name'] }],
      attributes: ['materialId', 'title', 'description', 'fileUrl', 'createdAt']
    });

    const avgPercentage = recentResults.length > 0 
      ? (recentResults.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / recentResults.length).toFixed(2)
      : 0;

    const stats = {
      totalExams,
      attemptedExams,
      pendingExams: totalExams - attemptedExams,
      avgPercentage,
      recentResults,
      upcomingExams,
      latestMaterials,
      studentName: student.name
    };

    sendSuccess(res, 'Student dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

module.exports = { getAdminDashboard, getStaffDashboard, getStudentDashboard };