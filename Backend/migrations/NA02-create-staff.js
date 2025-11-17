'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Staffs', {
            staffId: {
                type: Sequelize.STRING(10),
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            // address: {
            //     type: Sequelize.TEXT,
            //     allowNull: true
            // },
            qualification: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            experience: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            subjectExpertise: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            userId: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            batchId: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
 
            avatar: {
                type: Sequelize.STRING(255),
                allowNull: true
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
        await queryInterface.dropTable('Staffs');
    }
};