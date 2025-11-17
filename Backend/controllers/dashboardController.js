const { User, Student, Staff, Course, Batch, Exam, Attendance, Result } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../utils/response');

const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.count({ where: { status: 'active' } });
    const totalStaff = await Staff.count({ where: { status: 'active' } });
    const totalCourses = await Course.count({ where: { status: 'active' } });
    const totalBatches = await Batch.count({ where: { status: 'active' } });
    
    const upcomingExams = await Exam.findAll({
      where: { status: 'scheduled' },
      limit: 5,
      order: [['date', 'ASC']]
    });

    const recentAttendance = await Attendance.findAll({
      limit: 10,
      order: [['date', 'DESC']]
    });

    const stats = {
      totalStudents,
      totalStaff,
      totalCourses,
      totalBatches,
      upcomingExams,
      recentAttendance
    };

    sendSuccess(res, 'Admin dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.staffProfile?.staffId;
    
    const assignedBatches = await Batch.findAll({
      where: { staffIds: { [Op.contains]: [staffId] } }
    });

    const pendingExams = await Exam.count({
      where: { status: 'scheduled' }
    });

    const todayAttendance = await Attendance.count({
      where: { 
        markedBy: staffId,
        date: new Date().toISOString().split('T')[0]
      }
    });

    const stats = {
      assignedBatches: assignedBatches.length,
      pendingExams,
      todayAttendance,
      batches: assignedBatches
    };

    sendSuccess(res, 'Staff dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.studentProfile?.studentId;
    
    const upcomingExams = await Exam.findAll({
      where: { status: 'scheduled' },
      limit: 5,
      order: [['date', 'ASC']]
    });

    const recentResults = await Result.findAll({
      where: { studentId },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const attendanceCount = await Attendance.count({
      where: {
        records: { [Op.contains]: [{ studentId, status: 'Present' }] }
      }
    });

    const stats = {
      upcomingExams,
      recentResults,
      attendanceCount
    };

    sendSuccess(res, 'Student dashboard data retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, 'Failed to get dashboard data', error);
  }
};

module.exports = { getAdminDashboard, getStaffDashboard, getStudentDashboard };