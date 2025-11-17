const { QuestionPaper, Subject, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createQuestionPaper = async (req, res) => {
  try {
    const { courseId, subjectId, batchId, title, description, examDate, totalMarks, duration, questionSet } = req.body;

    const questionPaper = await QuestionPaper.create({
      qpId: generateIds.questionPaper(),
      courseId, subjectId, batchId, title, description, examDate, totalMarks, duration, questionSet,
      createdBy: req.user.role === 'staff' ? req.user.staffProfile?.staffId : req.user.userId,
      fileUrl: req.file ? req.file.path : null
    });

    sendSuccess(res, 'Question paper created successfully', questionPaper, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create question paper', error);
  }
};

const getAllQuestionPapers = async (req, res) => {
  try {
    const { page = 1, limit = 10, subjectId, batchId } = req.query;
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (batchId) where.batchId = batchId;

    const questionPapers = await QuestionPaper.findAndCountAll({
      where,
      include: [
        { model: Subject, as: 'subject', attributes: ['name'] },
        { model: Batch, as: 'batch', attributes: ['batchName'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['examDate', 'DESC']]
    });

    sendSuccess(res, 'Question papers retrieved successfully', {
      questionPapers: questionPapers.rows,
      totalCount: questionPapers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(questionPapers.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get question papers', error);
  }
};

const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findByPk(req.params.id, {
      include: [
        { model: Subject, as: 'subject' },
        { model: Batch, as: 'batch' }
      ]
    });

    if (!questionPaper) return sendError(res, 404, 'Question paper not found');
    sendSuccess(res, 'Question paper retrieved successfully', questionPaper);
  } catch (error) {
    sendError(res, 500, 'Failed to get question paper', error);
  }
};

const updateQuestionPaper = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) updateData.fileUrl = req.file.path;

    const [updatedRowsCount] = await QuestionPaper.update(updateData, {
      where: { qpId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Question paper not found');

    const updatedQuestionPaper = await QuestionPaper.findByPk(req.params.id);
    sendSuccess(res, 'Question paper updated successfully', updatedQuestionPaper);
  } catch (error) {
    sendError(res, 500, 'Failed to update question paper', error);
  }
};

const deleteQuestionPaper = async (req, res) => {
  try {
    const deletedRowsCount = await QuestionPaper.destroy({
      where: { qpId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Question paper not found');
    sendSuccess(res, 'Question paper deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete question paper', error);
  }
};

module.exports = { createQuestionPaper, getAllQuestionPapers, getQuestionPaperById, updateQuestionPaper, deleteQuestionPaper };