'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      courseId: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      courseName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fees: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subjectIds: {
        type: Sequelize.JSON,
        allowNull: true
      },
      syllabusUrl: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      eligibility: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('courses');
  }
};
