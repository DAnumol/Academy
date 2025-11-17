const { Staff, User } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createStaff = async (req, res) => {
  try {
    console.log('Staff creation request body:', req.body);
    const { userId, name, email, subjectExpertise, phone, qualification, experience, status, avatar, batchId } = req.body;
    const staffStatus = status !== undefined ? Boolean(status) : true;

    console.log('Extracted batchId:', batchId, 'Type:', typeof batchId);
    console.log('Looking for user with userId:', userId);
    
    // Check if user exists
    const user = await User.findByPk(userId);
    console.log('Found user:', user ? user.toJSON() : 'null');
    
    if (!user) {
      console.log('User not found with userId:', userId);
      return sendError(res, 400, 'Selected user not found');
    }

    // Update user role to staff
    await User.update({ role: 'staff' }, { where: { userId } });

    const staffId = generateIds.staff();

    const staffData = {
      staffId, 
      userId, 
      name: name || user.name, 
      email: email || user.email,
      subjectExpertise, 
      phone, 
      qualification, 
      experience,
      batchId: (batchId && batchId !== '') ? batchId : null,
      status: staffStatus,
      profilePic: avatar || (req.file ? req.file.path : null)
    };
    
    console.log('Creating staff with data:', staffData);
    const staff = await Staff.create(staffData);

    sendSuccess(res, 'Staff created successfully', staff, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create staff', error);
  }
};

const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, dropdown } = req.query;
    const where = {};
    const userWhere = {};
    
    // For dropdown, only show active staff with staff role
    if (dropdown === 'true') {
      where.status = true;
      userWhere.role = 'staff';
    } else if (status !== undefined) {
      where.status = status === 'true';
    }

    const staff = await Staff.findAndCountAll({
      where,
      include: [{ 
        model: User, 
        as: 'user', 
        attributes: ['name', 'email', 'role'],
        where: Object.keys(userWhere).length > 0 ? userWhere : undefined
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Staff retrieved successfully', {
      staff: staff.rows,
      totalCount: staff.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(staff.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get staff', error);
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!staff) return sendError(res, 404, 'Staff not found');
    sendSuccess(res, 'Staff retrieved successfully', staff);
  } catch (error) {
    sendError(res, 500, 'Failed to get staff', error);
  }
};

const updateStaff = async (req, res) => {
  try {
    const { avatar, batchId, ...updateData } = req.body;
    
    // Handle profilePic from avatar field
    if (avatar && typeof avatar === 'string') {
      updateData.profilePic = avatar;
    } else if (req.file) {
      updateData.profilePic = req.file.path;
    }
    
    // Handle batchId
    if (batchId) {
      updateData.batchId = batchId;
    }

    const [updatedRowsCount] = await Staff.update(updateData, {
      where: { staffId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Staff not found');

    const updatedStaff = await Staff.findByPk(req.params.id);
    sendSuccess(res, 'Staff updated successfully', updatedStaff);
  } catch (error) {
    sendError(res, 500, 'Failed to update staff', error);
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return sendError(res, 404, 'Staff not found');

    await User.destroy({ where: { userId: staff.userId } });
    await Staff.destroy({ where: { staffId: req.params.id } });

    sendSuccess(res, 'Staff deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete staff', error);
  }
};

module.exports = { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff };