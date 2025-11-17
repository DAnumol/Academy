const { Course, User } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createCourse = async (req, res) => {
  try {
    const { courseName, duration, description, fees, subjectIds, syllabusUrl, eligibility ,status} = req.body;

      const courseStatus = status !== undefined ? Boolean(status) : true;

    const course = await Course.create({
      courseId: generateIds.course(),
      courseName,
      duration,
      description,
      fees,
      subjectIds,
      syllabusUrl,
      eligibility,
      status: courseStatus,
      createdBy: req.user.userId
    });

    sendSuccess(res, 'Course created successfully', course, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create course', error);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const courses = await Course.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Courses retrieved successfully', {
      courses: courses.rows,
      totalCount: courses.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(courses.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get courses', error);
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['name', 'email'] }
      ]
    });

    if (!course) {
      return sendError(res, 404, 'Course not found');
    }

    sendSuccess(res, 'Course retrieved successfully', course);
  } catch (error) {
    sendError(res, 500, 'Failed to get course', error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await Course.update(updateData, {
      where: { courseId: id }
    });

    if (updatedRowsCount === 0) {
      return sendError(res, 404, 'Course not found');
    }

    const updatedCourse = await Course.findByPk(id);
    sendSuccess(res, 'Course updated successfully', updatedCourse);
  } catch (error) {
    sendError(res, 500, 'Failed to update course', error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await Course.destroy({
      where: { courseId: id }
    });

    if (deletedRowsCount === 0) {
      return sendError(res, 404, 'Course not found');
    }

    sendSuccess(res, 'Course deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete course', error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};