"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("pets", "clinic_id", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "clinics",
				key: "id",
			},
			onDelete: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("pets", "clinic_id");
	},
};
