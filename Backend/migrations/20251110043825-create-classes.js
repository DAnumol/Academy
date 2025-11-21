'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      classId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      className: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      batchId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'batches',
          key: 'batchId'
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
      subjectIds: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('classes');
  }
};
