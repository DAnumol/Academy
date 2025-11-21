'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      studentId: {
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
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
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
      batchId: {
        type: Sequelize.STRING(10),
        allowNull: true,
        references: {
          model: 'batches',
          key: 'batchId'
        }
      },
      courseId: {
        type: Sequelize.STRING(10),
        allowNull: true,
        references: {
          model: 'courses',
          key: 'courseId'
        }
      },
      rollNo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('students');
  }
};
