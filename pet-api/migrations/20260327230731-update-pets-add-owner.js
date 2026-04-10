"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		// Se existir user_id, remover
		await queryInterface.removeColumn("pets", "user_id").catch(() => {}); // evita erro se já não existir

		// Adicionar owner_id
		await queryInterface.addColumn("pets", "owner_id", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "owners",
				key: "id",
			},
			onDelete: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("pets", "owner_id");
	},
};
