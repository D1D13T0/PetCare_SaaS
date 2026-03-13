"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("pets", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			species: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			breed: {
				type: Sequelize.STRING,
			},
			birth_date: {
				type: Sequelize.DATE,
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
				onDelete: "CASCADE",
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
		await queryInterface.dropTable("pets");
	},
};
