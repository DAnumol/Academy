'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('subjects');
    if (tableDescription.staffId) {
      await queryInterface.removeColumn('subjects', 'staffId');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('subjects', 'staffId', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'staffs',
        key: 'staffId'
      }
    });
  }
};
