const { Notification } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const createNotification = async (req, res) => {
  try {
    const { title, message, forRole, targetBatchIds } = req.body;

    const notification = await Notification.create({
      notificationId: generateIds.notification(),
      title, message, forRole, targetBatchIds,
      createdBy: req.user.userId
    });

    sendSuccess(res, 'Notification created successfully', notification, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to create notification', error);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, forRole } = req.query;
    const where = {};
    if (forRole) where.forRole = forRole;

    const notifications = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Notifications retrieved successfully', {
      notifications: notifications.rows,
      totalCount: notifications.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(notifications.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get notifications', error);
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) return sendError(res, 404, 'Notification not found');
    sendSuccess(res, 'Notification retrieved successfully', notification);
  } catch (error) {
    sendError(res, 500, 'Failed to get notification', error);
  }
};

const updateNotification = async (req, res) => {
  try {
    const [updatedRowsCount] = await Notification.update(req.body, {
      where: { notificationId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Notification not found');

    const updatedNotification = await Notification.findByPk(req.params.id);
    sendSuccess(res, 'Notification updated successfully', updatedNotification);
  } catch (error) {
    sendError(res, 500, 'Failed to update notification', error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deletedRowsCount = await Notification.destroy({
      where: { notificationId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Notification not found');
    sendSuccess(res, 'Notification deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete notification', error);
  }
};

module.exports = { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification };