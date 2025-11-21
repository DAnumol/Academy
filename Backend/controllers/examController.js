const { Exam, QuestionPaper, Batch, Student, Result } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const NEET_CONFIG = {
  TOTAL_MARKS: 720,
  TOTAL_QUESTIONS: 180,
  MARKS_PER_CORRECT: 4,
  MARKS_PER_INCORRECT: -1
};
 
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
    const { userId, role } = req.user;
    const where = {};
    
    if (role === 'student') {
      const student = await Student.findOne({ where: { userId } });
      if (!student) return sendError(res, 404, 'Student not found');
      where.batchId = student.batchId;
      where.status = true;
    } else {
      if (batchId) where.batchId = batchId;
      if (status) where.status = status;
    }
 
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
 
const getStudentExams = async (req, res) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ where: { userId } });
    if (!student) return sendError(res, 404, 'Student not found');

    const exams = await Exam.findAll({
      where: { batchId: student.batchId, status: true },
      include: [
        { model: QuestionPaper, as: 'questionPaper', attributes: ['qpId', 'title', 'totalMarks', 'duration', 'questionSet'] },
        { model: Batch, as: 'batch', attributes: ['batchName'] }
      ],
      order: [['date', 'DESC']]
    });

    const examsWithStatus = await Promise.all(exams.map(async (exam) => {
      const result = await Result.findOne({ where: { examId: exam.examId, studentId: student.studentId } });
      return {
        ...exam.toJSON(),
        attempted: !!result,
        resultId: result?.resultId,
        studentAnswers: result?.studentAnswers
      };
    }));

    sendSuccess(res, 'Student exams retrieved successfully', examsWithStatus);
  } catch (error) {
    sendError(res, 500, 'Failed to get student exams', error);
  }
};

const submitExam = async (req, res) => {
  try {
    const { examId, answers, violations } = req.body;
    const { userId } = req.user;

    const student = await Student.findOne({ where: { userId } });
    if (!student) return sendError(res, 404, 'Student not found');

    const exam = await Exam.findOne({
      where: { examId },
      include: [{ model: QuestionPaper, as: 'questionPaper' }]
    });
    if (!exam) return sendError(res, 404, 'Exam not found');

    const existingResult = await Result.findOne({ where: { examId, studentId: student.studentId } });
    if (existingResult) return sendError(res, 400, 'Exam already submitted');

    const questionSet = exam.questionPaper.questionSet || [];
    let obtainedMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    questionSet.forEach((q) => {
      const studentAnswer = answers[q.id];
      if (studentAnswer) {
        if (studentAnswer === q.correctAnswer) {
          obtainedMarks += NEET_CONFIG.MARKS_PER_CORRECT;
          correctCount++;
        } else {
          obtainedMarks += NEET_CONFIG.MARKS_PER_INCORRECT;
          incorrectCount++;
        }
      }
    });

    const percentage = ((obtainedMarks / NEET_CONFIG.TOTAL_MARKS) * 100).toFixed(2);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';

    const result = await Result.create({
      resultId: generateIds.result(),
      studentId: student.studentId,
      examId,
      totalMarks: NEET_CONFIG.TOTAL_MARKS,
      obtainedMarks,
      percentage,
      grade,
      studentAnswers: answers,
      violations: violations || [],
      violationCount: violations ? violations.length : 0,
      status: true
    });

    sendSuccess(res, 'Exam submitted successfully', result, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to submit exam', error);
  }
};

module.exports = { createExam, getAllExams, getExamById, updateExam, deleteExam, toggleExamStatus, getStudentExams, submitExam };
 