'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      notificationId: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      forRole: {
        type: Sequelize.ENUM('admin', 'staff', 'student', 'all'),
        allowNull: false
      },
      targetBatchIds: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};
