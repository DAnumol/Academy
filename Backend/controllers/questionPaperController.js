// const { QuestionPaper, Subject, Batch } = require('../models');
// const generateIds = require('../utils/generateId');
// const { sendSuccess, sendError } = require('../utils/response');

// const transformQuestionSet = (questionSet, imageUrls = {}, marksPerCorrect = 4, marksPerIncorrect = -1) => {
//   if (!questionSet || !Array.isArray(questionSet)) return null;
  
//   return questionSet.map((q, index) => ({
//     id: `q${index + 1}`,
//     question: q.questionText || q.question,
//     type: 'mcq',
//     options: q.options || [],
//     correctAnswer: q.options && q.correctAnswer ? q.options[q.correctAnswer.charCodeAt(0) - 65] : q.correctAnswer,
//     marks: marksPerCorrect,
//     negativeMarks: marksPerIncorrect,
//     imageUrl: imageUrls[index] || q.imageUrl || null
//   }));
// };

// const createQuestionPaper = async (req, res) => {
//   try {
//     const { courseId, subjectId, batchId, title, description, examDate, totalMarks, duration, marksPerCorrect, marksPerIncorrect, questionSet, status } = req.body;

//     let parsedQuestionSet = questionSet;
//     if (typeof questionSet === 'string') {
//       try {
//         parsedQuestionSet = JSON.parse(questionSet);
//       } catch (e) {
//         console.error('Failed to parse questionSet:', e);
//         parsedQuestionSet = null;
//       }
//     }
    
//     // if (parsedQuestionSet && Array.isArray(parsedQuestionSet) && parsedQuestionSet.length > 0) {
//     //   if (parsedQuestionSet.length !== NEET_CONFIG.TOTAL_QUESTIONS) {
//     //     return sendError(res, 400, `Question paper must have exactly ${NEET_CONFIG.TOTAL_QUESTIONS} questions`);
//     //   }
//     // }
    
//     const imageUrls = {};
//     if (req.files && Array.isArray(req.files)) {
//       req.files.forEach(file => {
//         if (file.fieldname.startsWith('questionImage')) {
//           const index = parseInt(file.fieldname.replace('questionImage', ''));
//           const filePath = file.path.replace(/\\/g, '/');
//           imageUrls[index] = filePath.startsWith('uploads/') ? `/${filePath}` : `/uploads/${filePath}`;
//         }
//       });
//     }
    
//     const transformedQuestionSet = transformQuestionSet(parsedQuestionSet, imageUrls, marksPerCorrect || 4, marksPerIncorrect || -1);

//     const questionPaperStatus = status !== undefined ? Boolean(status) : true;
    
//     // Handle file URL for main question paper file
//     let fileUrl = null;
//     if (req.files && Array.isArray(req.files)) {
//       const questionPaperFile = req.files.find(f => f.fieldname === 'questionPaper');
//       if (questionPaperFile) {
//         fileUrl = `/uploads/${questionPaperFile.path.replace(/\\/g, '/')}`;
//       }
//     }
//     const questionPaper = await QuestionPaper.create({
//       qpId: generateIds.questionPaper(),
//       courseId, 
//       subjectId, 
//       batchId, 
//       title, 
//       description, 
//       examDate, 
//       totalMarks: totalMarks || 720, 
//       duration: duration || 180, 
//       marksPerCorrect: marksPerCorrect || 4,
//       marksPerIncorrect: marksPerIncorrect || -1,
//       questionSet: transformedQuestionSet,
//       fileUrl,
//       status: questionPaperStatus
//     });

//     sendSuccess(res, 'Question paper created successfully', questionPaper, 201);
//   } catch (error) {
//     sendError(res, 500, 'Failed to create question paper', error);
//   }
// };

// const getAllQuestionPapers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, subjectId, batchId } = req.query;
//     const where = {};
//     if (subjectId) where.subjectId = subjectId;
//     if (batchId) where.batchId = batchId;

//     const questionPapers = await QuestionPaper.findAndCountAll({
//       where,
//       include: [
//         { model: Subject, as: 'subject', attributes: ['name'] },
//         { model: Batch, as: 'batch', attributes: ['batchName'] }
//       ],
//       limit: parseInt(limit),
//       offset: (parseInt(page) - 1) * parseInt(limit),
//       order: [['examDate', 'DESC']]
//     });

//     sendSuccess(res, 'Question papers retrieved successfully', {
//       questionPapers: questionPapers.rows,
//       totalCount: questionPapers.count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(questionPapers.count / parseInt(limit))
//     });
//   } catch (error) {
//     sendError(res, 500, 'Failed to get question papers', error);
//   }
// };

// const getQuestionPaperById = async (req, res) => {
//   try {
//     const questionPaper = await QuestionPaper.findOne({
//       where: { qpId: req.params.id },
//       include: [
//         { model: Subject, as: 'subject' },
//         { model: Batch, as: 'batch' }
//       ]
//     });

//     if (!questionPaper) return sendError(res, 404, 'Question paper not found');
//     sendSuccess(res, 'Question paper retrieved successfully', questionPaper);
//   } catch (error) {
//     sendError(res, 500, 'Failed to get question paper', error);
//   }
// };

// const updateQuestionPaper = async (req, res) => {
//   try {
//     const updateData = req.body;
    
//     // Handle file URL for main question paper file
//     if (req.files && Array.isArray(req.files)) {
//       const questionPaperFile = req.files.find(f => f.fieldname === 'questionPaper');
//       if (questionPaperFile) {
//         updateData.fileUrl = `/uploads/${questionPaperFile.path.replace(/\\/g, '/')}`;
//       }
//     }
    
//     if (updateData.questionSet && typeof updateData.questionSet === 'string') {
//       try {
//         updateData.questionSet = JSON.parse(updateData.questionSet);
//       } catch (e) {
//         console.error('Failed to parse questionSet:', e);
//       }
//     }
    
//     if (updateData.questionSet && Array.isArray(updateData.questionSet) && updateData.questionSet.length > 0) {
//       // if (updateData.questionSet.length !== NEET_CONFIG.TOTAL_QUESTIONS) {
//       //   return sendError(res, 400, `Question paper must have exactly ${NEET_CONFIG.TOTAL_QUESTIONS} questions`);
//       // }
      
//       const imageUrls = {};
//       if (req.files && Array.isArray(req.files)) {
//         req.files.forEach(file => {
//           if (file.fieldname.startsWith('questionImage')) {
//             const index = parseInt(file.fieldname.replace('questionImage', ''));
//             const filePath = file.path.replace(/\\/g, '/');
//             imageUrls[index] = filePath.startsWith('uploads/') ? `/${filePath}` : `/uploads/${filePath}`;
//           }
//         });
//       }
      
//       updateData.questionSet = transformQuestionSet(updateData.questionSet, imageUrls, updateData.marksPerCorrect || 4, updateData.marksPerIncorrect || -1);
//     }

//     const [updatedRowsCount] = await QuestionPaper.update(updateData, {
//       where: { qpId: req.params.id }
//     });

//     if (updatedRowsCount === 0) return sendError(res, 404, 'Question paper not found');

//     const updatedQuestionPaper = await QuestionPaper.findOne({
//       where: { qpId: req.params.id }
//     });
//     sendSuccess(res, 'Question paper updated successfully', updatedQuestionPaper);
//   } catch (error) {
//     sendError(res, 500, 'Failed to update question paper', error);
//   }
// };

// const deleteQuestionPaper = async (req, res) => {
//   try {
//     const deletedRowsCount = await QuestionPaper.destroy({
//       where: { qpId: req.params.id }
//     });

//     if (deletedRowsCount === 0) return sendError(res, 404, 'Question paper not found');
//     sendSuccess(res, 'Question paper deleted successfully');
//   } catch (error) {
//     sendError(res, 500, 'Failed to delete question paper', error);
//   }
// };

// module.exports = { createQuestionPaper, getAllQuestionPapers, getQuestionPaperById, updateQuestionPaper, deleteQuestionPaper };

const { QuestionPaper, Subject, Batch } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const transformQuestionSet = (questionSet, imageUrls = {}, marksPerCorrect, marksPerIncorrect) => {
  if (!questionSet || !Array.isArray(questionSet)) return null;
  
  return questionSet.map((q, index) => ({
    id: `q${index + 1}`,
    question: q.questionText || q.question,
    type: 'mcq',
    options: q.options || [],
    correctAnswer: q.options && q.correctAnswer ? q.options[q.correctAnswer.charCodeAt(0) - 65] : q.correctAnswer,
    marks: marksPerCorrect,
    negativeMarks: marksPerIncorrect,
    imageUrl: imageUrls[index] || q.imageUrl || null
  }));
};

const createQuestionPaper = async (req, res) => {
  try {
    const { courseId, subjectId, batchId, title, description, examDate, startTime, totalMarks, duration, marksPerCorrect, marksPerIncorrect, questionSet, status } = req.body;

    let parsedQuestionSet = questionSet;
    if (typeof questionSet === 'string') {
      try {
        parsedQuestionSet = JSON.parse(questionSet);
      } catch (e) {
        console.error('Failed to parse questionSet:', e);
        parsedQuestionSet = null;
      }
    }
    
    // if (parsedQuestionSet && Array.isArray(parsedQuestionSet) && parsedQuestionSet.length > 0) {
    //   if (parsedQuestionSet.length !== NEET_CONFIG.TOTAL_QUESTIONS) {
    //     return sendError(res, 400, `Question paper must have exactly ${NEET_CONFIG.TOTAL_QUESTIONS} questions`);
    //   }
    // }
    
    const imageUrls = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (file.fieldname.startsWith('questionImage')) {
          const index = parseInt(file.fieldname.replace('questionImage', ''));
          const filePath = file.path.replace(/\\/g, '/');
          imageUrls[index] = filePath.startsWith('uploads/') ? `/${filePath}` : `/uploads/${filePath}`;
        }
      });
    }
    
    const transformedQuestionSet = transformQuestionSet(parsedQuestionSet, imageUrls, parseInt(marksPerCorrect), parseInt(marksPerIncorrect));

    const questionPaperStatus = status !== undefined ? Boolean(status) : true;
    
    // Handle file URL for main question paper file
    let fileUrl = null;
    if (req.files && Array.isArray(req.files)) {
      const questionPaperFile = req.files.find(f => f.fieldname === 'questionPaper');
      if (questionPaperFile) {
        fileUrl = `/uploads/${questionPaperFile.path.replace(/\\/g, '/')}`;
      }
    }
    const questionPaper = await QuestionPaper.create({
      qpId: generateIds.questionPaper(),
      courseId, 
      subjectId, 
      batchId, 
      title, 
      description, 
      examDate,
      startTime: startTime || null, 
      totalMarks: parseInt(totalMarks), 
      duration: parseInt(duration), 
      marksPerCorrect: parseInt(marksPerCorrect),
      marksPerIncorrect: parseInt(marksPerIncorrect),
      questionSet: transformedQuestionSet,
      fileUrl,
      status: questionPaperStatus
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
    const questionPaper = await QuestionPaper.findOne({
      where: { qpId: req.params.id },
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
    
    // Handle file URL for main question paper file
    if (req.files && Array.isArray(req.files)) {
      const questionPaperFile = req.files.find(f => f.fieldname === 'questionPaper');
      if (questionPaperFile) {
        updateData.fileUrl = `/uploads/${questionPaperFile.path.replace(/\\/g, '/')}`;
      }
    }
    
    if (updateData.questionSet && typeof updateData.questionSet === 'string') {
      try {
        updateData.questionSet = JSON.parse(updateData.questionSet);
      } catch (e) {
        console.error('Failed to parse questionSet:', e);
      }
    }
    
    if (updateData.questionSet && Array.isArray(updateData.questionSet) && updateData.questionSet.length > 0) {
      // if (updateData.questionSet.length !== NEET_CONFIG.TOTAL_QUESTIONS) {
      //   return sendError(res, 400, `Question paper must have exactly ${NEET_CONFIG.TOTAL_QUESTIONS} questions`);
      // }
      
      const imageUrls = {};
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => {
          if (file.fieldname.startsWith('questionImage')) {
            const index = parseInt(file.fieldname.replace('questionImage', ''));
            const filePath = file.path.replace(/\\/g, '/');
            imageUrls[index] = filePath.startsWith('uploads/') ? `/${filePath}` : `/uploads/${filePath}`;
          }
        });
      }
      
      updateData.questionSet = transformQuestionSet(updateData.questionSet, imageUrls, parseInt(updateData.marksPerCorrect), parseInt(updateData.marksPerIncorrect));
    }

    const [updatedRowsCount] = await QuestionPaper.update(updateData, {
      where: { qpId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Question paper not found');

    const updatedQuestionPaper = await QuestionPaper.findOne({
      where: { qpId: req.params.id }
    });
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