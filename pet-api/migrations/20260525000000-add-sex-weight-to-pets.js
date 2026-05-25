'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('pets', 'sex', {
			type: Sequelize.ENUM('M', 'F'),
			allowNull: true,
		});
		await queryInterface.addColumn('pets', 'weight', {
			type: Sequelize.FLOAT,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('pets', 'sex');
		await queryInterface.removeColumn('pets', 'weight');
	},
};
