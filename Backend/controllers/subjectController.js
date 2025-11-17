const { Subject, Staff } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createSubject = async (req, res) => {
  try {
    const { name, code, staffId,status } = req.body;
 const subjectStatus = status !== undefined ? Boolean(status) : true;
    const subject = await Subject.create({
      subjectId: generateIds.subject(),
      name, code, staffId,
      status:subjectStatus
    });

    sendSuccess(res, 'Subject created successfully', subject, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create subject', error);
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [{ model: Staff, as: 'staff', attributes: ['name', 'email','status'] }],
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Subjects retrieved successfully', subjects);
  } catch (error) {
    sendError(res, 500, 'Failed to get subjects', error);
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [{ model: Staff, as: 'staff' }]
    });

    if (!subject) return sendError(res, 404, 'Subject not found');
    sendSuccess(res, 'Subject retrieved successfully', subject);
  } catch (error) {
    sendError(res, 500, 'Failed to get subject', error);
  }
};

const updateSubject = async (req, res) => {
  try {
    const [updatedRowsCount] = await Subject.update(req.body, {
      where: { subjectId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Subject not found');

    const updatedSubject = await Subject.findByPk(req.params.id);
    sendSuccess(res, 'Subject updated successfully', updatedSubject);
  } catch (error) {
    sendError(res, 500, 'Failed to update subject', error);
  }
};



const deleteSubject = async (req, res) => {
  try {
    const deletedRowsCount = await Subject.destroy({
      where: { subjectId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Subject not found');
    sendSuccess(res, 'Subject deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete subject', error);
  }
};

module.exports = { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject };