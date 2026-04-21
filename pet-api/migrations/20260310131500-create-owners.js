"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("owners", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			clinic_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "clinics",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
			},
			phone: {
				type: Sequelize.STRING,
			},
			document: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("NOW()"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("NOW()"),
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("owners");
	},
};
