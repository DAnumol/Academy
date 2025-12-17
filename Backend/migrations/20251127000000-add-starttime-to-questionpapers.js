'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('questionpapers');
    
    if (!tableDescription.startTime) {
      await queryInterface.addColumn('questionpapers', 'startTime', {
        type: Sequelize.TIME,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('questionpapers', 'startTime');
  }
};
