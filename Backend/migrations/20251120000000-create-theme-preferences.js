'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('theme_preferences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      colors: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          primary: '#0ea5e9',
          secondary: '#d946ef',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          background: '#ffffff',
          surface: '#f9fafb',
          text: '#111827',
          border: '#e5e7eb',
          sidebar: '#1e293b',
          header: '#ffffff'
        }
      },
      typography: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          fontFamily: 'Inter',
          fontSize: 'medium',
          fontWeight: 'normal'
        }
      },
      layout: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          borderRadius: 'medium',
          spacing: 'medium',
          shadows: 'medium'
        }
      },
      mode: {
        type: Sequelize.ENUM('light', 'dark', 'system'),
        defaultValue: 'system'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('theme_preferences');
  }
};
