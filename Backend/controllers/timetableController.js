const { Timetable, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');
const { validationResult } = require('express-validator');

const createTimetable = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    
    console.log('Create timetable request body:', JSON.stringify(req.body, null, 2));
    console.log('Schedule field type:', typeof req.body.schedule);
    console.log('Schedule field value:', req.body.schedule);
    
    const { batchId, weekStartDate, schedule, status } = req.body;

    const timetableStatus = status !== undefined ? Boolean(status) : true;

    // Ensure schedule is properly formatted
    let processedSchedule = schedule;
    if (schedule && typeof schedule === 'string') {
      try {
        processedSchedule = JSON.parse(schedule);
      } catch (e) {
        console.error('Failed to parse schedule JSON:', e);
      }
    }

    const timetable = await Timetable.create({
      timetableId: generateIds.timetable(),
      batchId, 
      weekStartDate, 
      schedule: processedSchedule,
      createdBy: req.user.userId,
      status: timetableStatus
    });

    console.log('Created timetable schedule:', timetable.schedule);
    sendSuccess(res, 'Timetable created successfully', timetable, 201);
  } catch (error) {
    console.error('Create timetable error:', error);
    sendError(res, 500, 'Failed to create timetable', error);
  }
};

const getAllTimetables = async (req, res) => {
  try {
    const { batchId } = req.query;
    const { userId, role } = req.user;
    const where = {};
    
    if (role === 'student') {
      const { Student } = require('../models');
      const student = await Student.findOne({ where: { userId } });
      if (!student) return sendError(res, 404, 'Student not found');
      where.batchId = student.batchId;
      where.status = true;
    } else {
      if (batchId) where.batchId = batchId;
    }

    const timetables = await Timetable.findAll({
      where,
      include: [{ model: Batch, as: 'batch', attributes: ['batchName'] }],
      order: [['weekStartDate', 'DESC']]
    });

    sendSuccess(res, 'Timetables retrieved successfully', timetables);
  } catch (error) {
    sendError(res, 500, 'Failed to get timetables', error);
  }
};

const getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id, {
      include: [{ model: Batch, as: 'batch' }]
    });

    if (!timetable) return sendError(res, 404, 'Timetable not found');
    sendSuccess(res, 'Timetable retrieved successfully', timetable);
  } catch (error) {
    sendError(res, 500, 'Failed to get timetable', error);
  }
};

const updateTimetable = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    
    console.log('Update timetable request body:', JSON.stringify(req.body, null, 2));
    console.log('Schedule field type:', typeof req.body.schedule);
    console.log('Schedule field value:', req.body.schedule);
    
    // Ensure schedule is properly formatted
    if (req.body.schedule && typeof req.body.schedule === 'string') {
      try {
        req.body.schedule = JSON.parse(req.body.schedule);
      } catch (e) {
        console.error('Failed to parse schedule JSON:', e);
      }
    }
    
    const [updatedRowsCount] = await Timetable.update(req.body, {
      where: { timetableId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Timetable not found');

    const updatedTimetable = await Timetable.findOne({
      where: { timetableId: req.params.id },
      include: [{ model: Batch, as: 'batch', attributes: ['batchName'] }]
    });
    
    console.log('Updated timetable schedule:', updatedTimetable.schedule);
    sendSuccess(res, 'Timetable updated successfully', updatedTimetable);
  } catch (error) {
    console.error('Update timetable error:', error);
    sendError(res, 500, 'Failed to update timetable', error);
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const deletedRowsCount = await Timetable.destroy({
      where: { timetableId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Timetable not found');
    sendSuccess(res, 'Timetable deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete timetable', error);
  }
};

module.exports = { createTimetable, getAllTimetables, getTimetableById, updateTimetable, deleteTimetable };