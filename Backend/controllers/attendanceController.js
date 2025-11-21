const { Attendance, Batch, Subject } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const markAttendance = async (req, res) => {
  try {
    const { batchId, subjectId, date, records } = req.body;

    const attendance = await Attendance.create({
      attendanceId: generateIds.attendance(),
      batchId, subjectId, date, records,
      // markedBy: req.user.staffProfile?.staffId || req.user.userId
    });

    sendSuccess(res, 'Attendance marked successfully', attendance, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to mark attendance', error);
  }
};

const getAttendance = async (req, res) => {
  try {
    const { batchId, subjectId, date, page = 1, limit = 10 } = req.query;
    const where = {};
    if (batchId) where.batchId = batchId;
    if (subjectId) where.subjectId = subjectId;
    if (date) where.date = date;

    const attendance = await Attendance.findAndCountAll({
      where,
      include: [
        { model: Batch, as: 'batch', attributes: ['batchName'] },
        { model: Subject, as: 'subject', attributes: ['name'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['date', 'DESC']]
    });

    sendSuccess(res, 'Attendance retrieved successfully', {
      attendance: attendance.rows,
      totalCount: attendance.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(attendance.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get attendance', error);
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [
        { model: Batch, as: 'batch' },
        { model: Subject, as: 'subject' }
      ]
    });

    if (!attendance) return sendError(res, 404, 'Attendance record not found');
    sendSuccess(res, 'Attendance retrieved successfully', attendance);
  } catch (error) {
    sendError(res, 500, 'Failed to get attendance', error);
  }
};

const updateAttendance = async (req, res) => {
  try {
    const [updatedRowsCount] = await Attendance.update(req.body, {
      where: { attendanceId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Attendance record not found');

    const updatedAttendance = await Attendance.findByPk(req.params.id);
    sendSuccess(res, 'Attendance updated successfully', updatedAttendance);
  } catch (error) {
    sendError(res, 500, 'Failed to update attendance', error);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const deletedRowsCount = await Attendance.destroy({
      where: { attendanceId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Attendance record not found');
    sendSuccess(res, 'Attendance deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete attendance', error);
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { Op } = require('sequelize');
    const attendance = await Attendance.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: Subject, as: 'subject', attributes: ['name'] }
      ],
      order: [['date', 'ASC']]
    });

    const studentRecords = [];
    attendance.forEach(record => {
      let records = record.records;
      
      // Parse if records is a string
      if (typeof records === 'string') {
        try {
          records = JSON.parse(records);
        } catch (e) {
          console.error('Failed to parse records:', e);
          return;
        }
      }
      
      if (records && Array.isArray(records)) {
        records.forEach(r => {
          if (r.studentId === studentId) {
            studentRecords.push({
              date: record.date,
              attendanceStatus: r.attendanceStatus,
              subject: record.subject?.name
            });
          }
        });
      }
    });

    sendSuccess(res, 'Student attendance retrieved successfully', studentRecords);
  } catch (error) {
    console.error('Error in getStudentAttendance:', error);
    sendError(res, 500, 'Failed to get student attendance', error);
  }
};

module.exports = { markAttendance, getAttendance, getAttendanceById, updateAttendance, deleteAttendance, getStudentAttendance };