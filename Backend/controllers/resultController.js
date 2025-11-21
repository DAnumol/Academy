const { Result, Student, Exam, QuestionPaper } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const NEET_CONFIG = {
  TOTAL_MARKS: 720,
  TOTAL_QUESTIONS: 180
};

const createResult = async (req, res) => {
  try {
    const { studentId, examId, obtainedMarks, grade, remarks, status } = req.body;
    const percentage = (obtainedMarks / NEET_CONFIG.TOTAL_MARKS) * 100;

    const resultStatus = status !== undefined ? Boolean(status) : true;

    const result = await Result.create({
      resultId: generateIds.result(),
      studentId, 
      examId, 
      totalMarks: NEET_CONFIG.TOTAL_MARKS, 
      obtainedMarks, 
      percentage, 
      grade, 
      remarks,
      status: resultStatus
    });

    sendSuccess(res, 'Result created successfully', result, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create result', error);
  }
};

const getAllResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, examId } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (examId) where.examId = examId;

    const results = await Result.findAndCountAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['name', 'rollNo'] },
        { model: Exam, as: 'exam', include: [{ model: QuestionPaper, as: 'questionPaper', attributes: ['title'] }] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Results retrieved successfully', {
      results: results.rows,
      totalCount: results.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(results.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get results', error);
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findOne({
      where: { resultId: req.params.id },
      include: [
        { model: Student, as: 'student' },
        { model: Exam, as: 'exam' }
      ]
    });

    if (!result) return sendError(res, 404, 'Result not found');
    sendSuccess(res, 'Result retrieved successfully', result);
  } catch (error) {
    sendError(res, 500, 'Failed to get result', error);
  }
};

const updateResult = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.totalMarks = NEET_CONFIG.TOTAL_MARKS;
    
    if (updateData.obtainedMarks) {
      updateData.percentage = (updateData.obtainedMarks / NEET_CONFIG.TOTAL_MARKS) * 100;
    }

    const [updatedRowsCount] = await Result.update(updateData, {
      where: { resultId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Result not found');

    const updatedResult = await Result.findOne({
      where: { resultId: req.params.id }
    });
    sendSuccess(res, 'Result updated successfully', updatedResult);
  } catch (error) {
    sendError(res, 500, 'Failed to update result', error);
  }
};

const deleteResult = async (req, res) => {
  try {
    const deletedRowsCount = await Result.destroy({
      where: { resultId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Result not found');
    sendSuccess(res, 'Result deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete result', error);
  }
};

const getStudentResults = async (req, res) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ where: { userId } });
    if (!student) return sendError(res, 404, 'Student not found');

    const results = await Result.findAll({
      where: { studentId: student.studentId },
      include: [
        { 
          model: Exam, 
          as: 'exam', 
          include: [{ 
            model: QuestionPaper, 
            as: 'questionPaper', 
            attributes: ['title', 'totalMarks'] 
          }] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Student results retrieved successfully', results);
  } catch (error) {
    sendError(res, 500, 'Failed to get student results', error);
  }
};

module.exports = { createResult, getAllResults, getResultById, updateResult, deleteResult, getStudentResults };