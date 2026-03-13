"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("appointments", {
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
			pet_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "pets",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			veterinarian_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM(
					"SCHEDULED",
					"CONFIRMED",
					"CANCELLED",
					"COMPLETED",
				),
				defaultValue: "SCHEDULED",
			},
			notes: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable("appointments");
	},
};
