import app from "./app";
import { sequelize } from "./config/database";
import "./models";

const PORT = 3000;

sequelize
	.authenticate()
	.then(() => {
		console.log("Banco conectado com sucesso");
		return sequelize.sync();
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Servidor rodando na porta ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Erro ao conectar no banco:", err);
	});
