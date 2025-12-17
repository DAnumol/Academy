const { FeePayment, Student, Course, User } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');
const { Op } = require('sequelize');

const createPayment = async (req, res) => {
  try {
    const { studentId, courseId, amount, paymentDate, paymentMethod, transactionId, remarks } = req.body;
    const { userId } = req.user;

    const student = await Student.findByPk(studentId);
    if (!student) return sendError(res, 404, 'Student not found');

    const finalCourseId = courseId || student.courseId;
    if (finalCourseId) {
      const course = await Course.findByPk(finalCourseId);
      if (!course) return sendError(res, 404, 'Course not found');
    }

    const receiptNumber = `RCP${Date.now()}`;

    const payment = await FeePayment.create({
      paymentId: generateIds.feePayment(),
      studentId,
      courseId: finalCourseId,
      amount: parseFloat(amount),
      paymentDate,
      paymentMethod,
      transactionId,
      remarks,
      receiptNumber,
      collectedBy: userId,
      status: true
    });

    sendSuccess(res, 'Payment recorded successfully', payment, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to record payment', error);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, courseId, paymentMethod, startDate, endDate } = req.query;
    
    const where = {};
    if (studentId) where.studentId = studentId;
    if (courseId) where.courseId = courseId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      where.paymentDate = { [Op.between]: [startDate, endDate] };
    }

    const payments = await FeePayment.findAndCountAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['name', 'rollNo'] },
        { model: Course, as: 'course', attributes: ['courseName', 'fees'] },
        { model: User, as: 'collector', attributes: ['username'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['paymentDate', 'DESC']]
    });

    sendSuccess(res, 'Payments retrieved successfully', {
      payments: payments.rows,
      totalCount: payments.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(payments.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get payments', error);
  }
};

const getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({
      where: { studentId },
      include: [{ model: Course, as: 'course', attributes: ['courseName', 'fees'] }]
    });

    if (!student) return sendError(res, 404, 'Student not found');

    const payments = await FeePayment.findAll({
      where: { studentId },
      order: [['paymentDate', 'ASC']]
    });

    const totalFees = student.specialFees ? parseFloat(student.specialFees) : parseFloat(student.course?.fees || 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const pendingAmount = totalFees - totalPaid;
    
    // Check if bypassed
    const isBypassed = payments.some(p => p.remarks && p.remarks.includes('bypassed'));
    const feeStatus = (pendingAmount <= 0 || isBypassed) ? 'Completed' : 'Pending';

    sendSuccess(res, 'Fee summary retrieved successfully', {
      student: {
        studentId: student.studentId,
        name: student.name,
        rollNo: student.rollNo,
        courseName: student.course?.courseName,
        courseId: student.courseId
      },
      totalFees,
      totalPaid,
      pendingAmount: (pendingAmount > 0 && !isBypassed) ? pendingAmount : 0,
      feeStatus,
      paymentHistory: payments
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get fee summary', error);
  }
};

const getStudentsWithPendingFees = async (req, res) => {
  try {
    const { bypass } = req.query;
    const students = await Student.findAll({
      include: [
        { model: Course, as: 'course', attributes: ['fees'] },
        { model: FeePayment, as: 'feePayments' }
      ]
    });

    if (bypass === 'true') {
      const allStudents = students.map(s => ({
        studentId: s.studentId,
        name: s.name,
        rollNo: s.rollNo
      }));
      return sendSuccess(res, 'All students retrieved', allStudents);
    }

    const studentsWithPending = students.filter(student => {
      const totalFees = student.specialFees ? parseFloat(student.specialFees) : parseFloat(student.course?.fees || 0);
      const totalPaid = student.feePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      // Include students with no fees set (totalFees === 0) OR students with pending fees
      return totalFees === 0 || totalFees > totalPaid;
    }).map(s => ({
      studentId: s.studentId,
      name: s.name,
      rollNo: s.rollNo
    }));

    sendSuccess(res, 'Students with pending fees retrieved', studentsWithPending);
  } catch (error) {
    sendError(res, 500, 'Failed to get students', error);
  }
};

const getFeeOverview = async (req, res) => {
  try {
    const { courseId, batchId, status } = req.query;
    const { userId, role } = req.user;

    const studentWhere = {};
    
    // If student role, only show their own fees
    if (role === 'student') {
      const student = await Student.findOne({ where: { userId } });
      if (!student) return sendError(res, 404, 'Student not found');
      studentWhere.studentId = student.studentId;
    } else {
      if (courseId) studentWhere.courseId = courseId;
      if (batchId) studentWhere.batchId = batchId;
    }

    const students = await Student.findAll({
      where: studentWhere,
      include: [
        { model: Course, as: 'course', attributes: ['courseName', 'fees'] },
        { model: FeePayment, as: 'feePayments' }
      ]
    });

    const feeData = students.map(student => {
      const totalFees = student.specialFees ? parseFloat(student.specialFees) : parseFloat(student.course?.fees || 0);
      const totalPaid = student.feePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pendingAmount = totalFees - totalPaid;
      
      // Check if bypassed (has payment with bypass remark)
      const isBypassed = student.feePayments.some(p => p.remarks && p.remarks.includes('bypassed'));
      const feeStatus = (pendingAmount <= 0 || isBypassed) ? 'Completed' : 'Pending';

      return {
        studentId: student.studentId,
        name: student.name,
        rollNo: student.rollNo,
        courseName: student.course?.courseName,
        totalFees,
        totalPaid,
        pendingAmount: (pendingAmount > 0 && !isBypassed) ? pendingAmount : 0,
        feeStatus,
        lastPaymentDate: student.feePayments[student.feePayments.length - 1]?.paymentDate || null
      };
    });

    const filteredData = status 
      ? feeData.filter(f => f.feeStatus === status)
      : feeData;

    sendSuccess(res, 'Fee overview retrieved successfully', filteredData);
  } catch (error) {
    sendError(res, 500, 'Failed to get fee overview', error);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeePayment.destroy({ where: { paymentId: id } });
    
    if (!deleted) return sendError(res, 404, 'Payment not found');
    sendSuccess(res, 'Payment deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete payment', error);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getStudentFeeSummary,
  getFeeOverview,
  getStudentsWithPendingFees,
  deletePayment
};
