const { Batch, Course } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createBatch = async (req, res) => {
  try {
    const { batchName, courseId, staffIds, studentIds, startDate, endDate,status } = req.body;

      const batchStatus = status !== undefined ? Boolean(status) : true;
    const batch = await Batch.create({
      batchId: generateIds.batch(),
      batchName, courseId, staffIds, studentIds, startDate, endDate,status:batchStatus
    });

    sendSuccess(res, 'Batch created successfully', batch, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create batch', error);
  }
};

const getAllBatches = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, courseId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (courseId) where.courseId = courseId;

    const batches = await Batch.findAndCountAll({
      where,
      include: [{ model: Course, as: 'course', attributes: ['courseName'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Batches retrieved successfully', {
      batches: batches.rows,
      totalCount: batches.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(batches.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get batches', error);
  }
};

const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!batch) return sendError(res, 404, 'Batch not found');
    sendSuccess(res, 'Batch retrieved successfully', batch);
  } catch (error) {
    sendError(res, 500, 'Failed to get batch', error);
  }
};

const updateBatch = async (req, res) => {
  try {
    const [updatedRowsCount] = await Batch.update(req.body, {
      where: { batchId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Batch not found');

    const updatedBatch = await Batch.findByPk(req.params.id);
    sendSuccess(res, 'Batch updated successfully', updatedBatch);
  } catch (error) {
    sendError(res, 500, 'Failed to update batch', error);
  }
};

const deleteBatch = async (req, res) => {
  try {
    const deletedRowsCount = await Batch.destroy({
      where: { batchId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Batch not found');
    sendSuccess(res, 'Batch deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete batch', error);
  }
};

module.exports = { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch };