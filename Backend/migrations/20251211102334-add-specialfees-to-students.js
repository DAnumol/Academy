'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('students');
    
    if (!tableDescription.specialFees) {
      await queryInterface.addColumn('students', 'specialFees', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('students', 'specialFees');
  }
};
