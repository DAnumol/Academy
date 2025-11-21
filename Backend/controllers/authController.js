const jwt = require('jsonwebtoken');
const { User, Student, Staff } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Student, as: 'studentProfile' },
        { model: Staff, as: 'staffProfile' }
      ]
    });

    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user.userId);
    
    const userData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.studentProfile?.profilePic || user.staffProfile?.profilePic || null,
      studentProfile: user.studentProfile || null,
      staffProfile: user.staffProfile || null
    };

    sendSuccess(res, 'Login successful', { user: userData, token });
  } catch (error) {
    sendError(res, 500, 'Login failed', error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, profileData } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    const userId = generateIds.user();
    
    const user = await User.create({
      userId,
      name,
      email,
      password,
      role
    });

    if (role === 'student' && profileData) {
      await Student.create({
        studentId: generateIds.student(),
        userId,
        ...profileData
      });
    } else if (role === 'staff' && profileData) {
      await Staff.create({
        staffId: generateIds.staff(),
        userId,
        ...profileData
      });
    }

    const token = generateToken(userId);
    
    sendSuccess(res, 'Registration successful', { 
      user: { userId, name, email, role }, 
      token 
    }, 201);
  } catch (error) {
    sendError(res, 500, 'Registration failed', error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        { model: Student, as: 'studentProfile' },
        { model: Staff, as: 'staffProfile' }
      ]
    });

    const userData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.studentProfile?.profilePic || user.staffProfile?.profilePic || null,
      studentProfile: user.studentProfile || null,
      staffProfile: user.staffProfile || null
    };

    sendSuccess(res, 'Profile retrieved successfully', userData);
  } catch (error) {
    sendError(res, 500, 'Failed to get profile', error);
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password, secretKey } = req.body;

    console.log('Received secretKey:', secretKey);
    console.log('Expected secretKey:', process.env.ADMIN_SECRET_KEY);
    console.log('Match:', secretKey === process.env.ADMIN_SECRET_KEY);

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return sendError(res, 403, 'Invalid admin secret key');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    const userId = generateIds.user();
    
    const user = await User.create({
      userId,
      name: username,
      email,
      password,
      role: 'admin'
    });

    const token = generateToken(userId);
    
    sendSuccess(res, 'Admin registration successful', { 
      user: { userId, name: username, email, role: 'admin' }, 
      token 
    }, 201);
  } catch (error) {
    sendError(res, 500, 'Admin registration failed', error);
  }
};

module.exports = { login, register, getProfile, registerAdmin };