const { Class, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createClass = async (req, res) => {
  try {
    const { className, batchId, staffIds, studentIds, subjectIds,status } = req.body;

     const classStatus = status !== undefined ? Boolean(status) : true;

    const classData = await Class.create({
      classId: generateIds.class(),
      className, batchId, staffIds, studentIds, subjectIds,
      status: classStatus
    });

    sendSuccess(res, 'Class created successfully', classData, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create class', error);
  }
};

const getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, batchId, status } = req.query;
    const where = {};
    if (batchId) where.batchId = batchId;
    if (status) where.status = status;

    const classes = await Class.findAndCountAll({
      where,
      include: [{ model: Batch, as: 'batch', attributes: ['batchName'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Classes retrieved successfully', {
      classes: classes.rows,
      totalCount: classes.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(classes.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get classes', error);
  }
};

const getClassById = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id, {
      include: [{ model: Batch, as: 'batch' }]
    });

    if (!classData) return sendError(res, 404, 'Class not found');
    sendSuccess(res, 'Class retrieved successfully', classData);
  } catch (error) {
    sendError(res, 500, 'Failed to get class', error);
  }
};

const updateClass = async (req, res) => {
  try {
    const [updatedRowsCount] = await Class.update(req.body, {
      where: { classId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Class not found');

    const updatedClass = await Class.findByPk(req.params.id);
    sendSuccess(res, 'Class updated successfully', updatedClass);
  } catch (error) {
    sendError(res, 500, 'Failed to update class', error);
  }
};

const deleteClass = async (req, res) => {
  try {
    const deletedRowsCount = await Class.destroy({
      where: { classId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Class not found');
    sendSuccess(res, 'Class deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete class', error);
  }
};

module.exports = { createClass, getAllClasses, getClassById, updateClass, deleteClass };