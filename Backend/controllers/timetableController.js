const { Timetable, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createTimetable = async (req, res) => {
  try {
    const { batchId, weekStartDate, schedule } = req.body;

    const timetable = await Timetable.create({
      timetableId: generateIds.timetable(),
      batchId, weekStartDate, schedule,
      createdBy: req.user.userId
    });

    sendSuccess(res, 'Timetable created successfully', timetable, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create timetable', error);
  }
};

const getAllTimetables = async (req, res) => {
  try {
    const { batchId } = req.query;
    const where = {};
    if (batchId) where.batchId = batchId;

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
    const [updatedRowsCount] = await Timetable.update(req.body, {
      where: { timetableId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Timetable not found');

    const updatedTimetable = await Timetable.findByPk(req.params.id);
    sendSuccess(res, 'Timetable updated successfully', updatedTimetable);
  } catch (error) {
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