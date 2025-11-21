'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batches', {
      batchId: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      batchName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      courseId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'courses',
          key: 'courseId'
        }
      },
      staffIds: {
        type: Sequelize.JSON,
        allowNull: true
      },
      studentIds: {
        type: Sequelize.JSON,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
    await queryInterface.dropTable('batches');
  }
};
