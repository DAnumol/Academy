'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staffs', {
      staffId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        }
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      subjectExpertise: {
        type: Sequelize.JSON,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      qualification: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      experience: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      batchId: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      profilePic: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('staffs');
  }
};
