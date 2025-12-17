'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('subjects');
    
    if (!tableDescription.staffIds) {
      await queryInterface.addColumn('subjects', 'staffIds', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('subjects', 'staffIds');
  }
};
