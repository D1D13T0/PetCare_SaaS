"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.ENUM("ADMIN", "OWNER"),
				defaultValue: "ADMIN",
			},
			clinic_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
					model: "clinics",
					key: "id",
				},
				onDelete: "SET NULL",
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
		await queryInterface.dropTable("users");
	},
};
