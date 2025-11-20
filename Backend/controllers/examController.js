const { Exam, QuestionPaper, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');
 
const createExam = async (req, res) => {
  try {
    const { courseId, qpId, batchId, date, status } = req.body;
const examStatus = status !== undefined ? Boolean(status) : true;
    const exam = await Exam.create({
      examId: generateIds.exam(),
      courseId: courseId || null,
      qpId,
      batchId,
      date,
      status: examStatus
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
      attributes: ['examId', 'courseId', 'qpId', 'batchId', 'date', 'status', 'createdAt', 'updatedAt'],
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
    const exam = await Exam.findOne({
      where: { examId: req.params.id },
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
    const updateData = { ...req.body };
 
    const [updatedRowsCount] = await Exam.update(updateData, {
      where: { examId: req.params.id }
    });
 
    if (updatedRowsCount === 0) return sendError(res, 404, 'Exam not found');
 
    const updatedExam = await Exam.findOne({
      where: { examId: req.params.id }
    });
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
 
const toggleExamStatus = async (req, res) => {
  try {
    const { id } = req.params;
   
    const exam = await Exam.findOne({ where: { examId: id } });
    if (!exam) {
      return sendError(res, 404, 'Exam not found');
    }
 
    const newStatus = exam.status === 1 ? 0 : 1;
    await Exam.update({ status: newStatus }, { where: { examId: id } });
 
    const updatedExam = await Exam.findOne({ where: { examId: id } });
    sendSuccess(res, `Exam ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, updatedExam);
  } catch (error) {
    sendError(res, 500, 'Failed to toggle exam status', error);
  }
};
 
module.exports = { createExam, getAllExams, getExamById, updateExam, deleteExam, toggleExamStatus };
 