const db = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    
    const whereClause = {};
    if (role) {
      whereClause.role = role;
    }
    if (status !== undefined) {
      whereClause.status = status === 'true' || status === true;
    }

    const users = await db.User.findAll({
      where: whereClause,
      attributes: ['userId', 'name', 'email', 'role','status','createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // If role filter is applied, return array for dropdown with combined display field
    // Otherwise return object with items for grid
    if (role) {
      const usersWithDisplay = users.map(user => ({
        ...user.toJSON(),
        displayName: `${user.userId} - ${user.name}`
      }));
      return sendSuccess(res, 'Users retrieved successfully', usersWithDisplay);
    } else {
      return sendSuccess(res, 'Users retrieved successfully', { items: users });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return sendError(res, 500, 'Failed to fetch users');
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db.User.findByPk(id, {
      attributes: ['userId', 'name', 'email', 'password', 'role','status', 'createdAt'],
      include: [
        {
          model: db.Student,
          as: 'studentProfile',
          required: false
        },
        {
          model: db.Staff,
          as: 'staffProfile',
          required: false
        }
      ]
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return sendError(res, 500, 'Failed to fetch user');
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    
    // Convert status to boolean (default to true if not provided)
    const userStatus = status !== undefined ? Boolean(status) : true;

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Missing required fields:', { name, email, password: !!password, role });
      return sendError(res, 400, 'Name, email, password, and role are required');
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists with email:', email);
      return sendError(res, 400, 'User with this email already exists');
    }

    // Generate unique userId
    let userId;
    let userExists = true;
    let counter = 1;
    
    while (userExists) {
      userId = `U${String(counter).padStart(3, '0')}`;
      const existingUserById = await db.User.findByPk(userId);
      if (!existingUserById) {
        userExists = false;
      } else {
        counter++;
      }
    }
    
    console.log('Generated userId:', userId);

    const user = await db.User.create({
      userId,
      name,
      email,
      password,
      role,
      status: userStatus
    });

    const userResponse = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    };

    return sendSuccess(res, 'User created successfully', userResponse, 201);
  } catch (error) {
    console.error('Error creating user:', error.message);
    console.error('Full error:', error);
    return sendError(res, 500, 'Failed to create user');
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      status: status !== undefined ? status : user.status
    };

    // Only update password if provided (model hook will hash it)
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    await user.update(updateData);

    const userResponse = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      updatedAt: user.updatedAt
    };

    return sendSuccess(res, 'User updated successfully', userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return sendError(res, 500, 'Failed to update user');
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    await user.destroy();
    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return sendError(res, 500, 'Failed to delete user');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};