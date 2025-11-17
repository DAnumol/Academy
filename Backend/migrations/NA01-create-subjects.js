'use strict';
 
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Subjects', {
            subjectId: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
 
            staffId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Staff',
                    key: 'staffId'
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
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
 
        });
    },
 
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Subjects');
    }
};
 
 
 