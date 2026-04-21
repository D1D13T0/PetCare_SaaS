"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("vaccines", {
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
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			application_date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			next_dose_date: {
				type: Sequelize.DATE,
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
		await queryInterface.dropTable("vaccines");
	},
};
