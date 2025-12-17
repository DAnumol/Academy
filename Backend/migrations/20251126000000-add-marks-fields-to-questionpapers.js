'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('questionpapers');
    
    if (!tableDescription.marksPerCorrect) {
      await queryInterface.addColumn('questionpapers', 'marksPerCorrect', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    }
    
    if (!tableDescription.marksPerIncorrect) {
      await queryInterface.addColumn('questionpapers', 'marksPerIncorrect', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('questionpapers', 'marksPerCorrect');
    await queryInterface.removeColumn('questionpapers', 'marksPerIncorrect');
  }
};
