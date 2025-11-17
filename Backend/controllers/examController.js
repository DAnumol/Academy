const { Exam, QuestionPaper, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createExam = async (req, res) => {
  try {
    const { courseId, qpId, batchId, date } = req.body;

    const exam = await Exam.create({
      examId: generateIds.exam(),
      courseId, qpId, batchId, date
    });

    sendSuccess(res, 'Exam created successfully', exam, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create exam', error);
  }
};

const getAllExams = async (req, res) => {
  try {
    const { page = 1, limit = 10, batchId, status } = req.query;
    const where = {};
    if (batchId) where.batchId = batchId;
    if (status) where.status = status;

    const exams = await Exam.findAndCountAll({
      where,
      include: [
        { model: QuestionPaper, as: 'questionPaper', attributes: ['title', 'totalMarks', 'duration'] },
        { model: Batch, as: 'batch', attributes: ['batchName'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['date', 'DESC']]
    });

    sendSuccess(res, 'Exams retrieved successfully', {
      exams: exams.rows,
      totalCount: exams.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(exams.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get exams', error);
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        { model: QuestionPaper, as: 'questionPaper' },
        { model: Batch, as: 'batch' }
      ]
    });

    if (!exam) return sendError(res, 404, 'Exam not found');
    sendSuccess(res, 'Exam retrieved successfully', exam);
  } catch (error) {
    sendError(res, 500, 'Failed to get exam', error);
  }
};

const updateExam = async (req, res) => {
  try {
    const [updatedRowsCount] = await Exam.update(req.body, {
      where: { examId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Exam not found');

    const updatedExam = await Exam.findByPk(req.params.id);
    sendSuccess(res, 'Exam updated successfully', updatedExam);
  } catch (error) {
    sendError(res, 500, 'Failed to update exam', error);
  }
};

const deleteExam = async (req, res) => {
  try {
    const deletedRowsCount = await Exam.destroy({
      where: { examId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Exam not found');
    sendSuccess(res, 'Exam deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete exam', error);
  }
};

module.exports = { createExam, getAllExams, getExamById, updateExam, deleteExam };