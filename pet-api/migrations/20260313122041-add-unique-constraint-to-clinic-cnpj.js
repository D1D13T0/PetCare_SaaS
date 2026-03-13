"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addConstraint("clinics", {
			fields: ["cnpj"],
			type: "unique",
			name: "unique_clinic_cnpj",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint("clinics", "unique_clinic_cnpj");
	},
};
