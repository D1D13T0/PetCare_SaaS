import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import Clinic from "../models/clinic";
import User from "../models/user";
import { isValidCNPJ } from "../utils/validateCNPJ";

export const createClinic = async (req: Request, res: Response) => {
	try {
		if (req.user!.clinic_id) {
			return res.status(400).json({
				message: "Usuário já pertence a uma clínica",
			});
		}

		const { name, cnpj } = req.body;

		if (!name) {
			return res.status(400).json({
				message: "Nome da clínica é obrigatório",
			});
		}

		if (cnpj && !isValidCNPJ(cnpj)) {
			return res.status(400).json({
				message: "CNPJ inválido",
			});
		}

		const clinic = await Clinic.create({ name, cnpj });

		await req.user!.update({ clinic_id: clinic.id });

		return res.status(201).json(clinic);
	} catch (error: any) {
		if (error instanceof UniqueConstraintError) {
			return res.status(400).json({
				message: "Já existe uma clínica com esse CNPJ",
			});
		}

		return res.status(500).json({
			message: "Erro ao criar clínica",
		});
	}
};

export const getClinic = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(404).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const clinic = await Clinic.findByPk(req.user!.clinic_id);

		return res.json(clinic);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao buscar clínica" });
	}
};

export const updateClinic = async (req: Request, res: Response) => {
	try {
		// Deve pertencer a uma clínica
		if (!req.user!.clinic_id) {
			return res.status(404).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		// Apenas ADMIN pode editar
		if (req.user!.role !== "ADMIN") {
			return res.status(403).json({
				message: "Apenas ADMIN pode editar a clínica",
			});
		}

		const clinic = await Clinic.findByPk(req.user!.clinic_id);

		if (!clinic) {
			return res.status(404).json({
				message: "Clínica não encontrada",
			});
		}

		const { name, cnpj } = req.body;

		if (cnpj && !isValidCNPJ(cnpj)) {
			return res.status(400).json({
				message: "CNPJ inválido",
			});
		}

		await clinic.update({
			name: name ?? clinic.name,
			cnpj: cnpj ?? clinic.cnpj,
		});

		return res.json(clinic);
	} catch (error: any) {
		if (error instanceof UniqueConstraintError) {
			return res.status(400).json({
				message: "Já existe uma clínica com esse CNPJ",
			});
		}

		return res.status(500).json({
			message: "Erro ao atualizar clínica",
		});
	}
};

export const inviteUserToClinic = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		if (req.user!.role !== "ADMIN") {
			return res.status(403).json({
				message: "Apenas ADMIN pode convidar usuários",
			});
		}

		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				message: "Email é obrigatório",
			});
		}

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({
				message: "Usuário não encontrado",
			});
		}

		if (user.clinic_id) {
			return res.status(400).json({
				message: "Usuário já pertence a uma clínica",
			});
		}

		await user.update({
			clinic_id: req.user!.clinic_id,
			role: "OWNER", // padrão
		});

		return res.json({
			message: "Usuário adicionado à clínica com sucesso",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao convidar usuário",
		});
	}
};

export const listClinicUsers = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const users = await User.findAll({
			where: { clinic_id: req.user!.clinic_id },
			attributes: { exclude: ["password"] }, // nunca retornar senha
		});

		return res.json(users);
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao listar usuários da clínica",
		});
	}
};

export const removeUserFromClinic = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		if (req.user!.role !== "ADMIN") {
			return res.status(403).json({
				message: "Apenas ADMIN pode remover usuários",
			});
		}

		const { userId } = req.params;

		if (!userId) {
			return res.status(400).json({
				message: "ID do usuário é obrigatório",
			});
		}

		if (userId === req.user!.id) {
			return res.status(400).json({
				message: "Você não pode remover a si mesmo",
			});
		}

		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).json({
				message: "Usuário não encontrado",
			});
		}

		if (user.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({
				message: "Usuário não pertence à sua clínica",
			});
		}

		await user.update({
			clinic_id: null,
			role: "OWNER",
		});

		return res.json({
			message: "Usuário removido da clínica com sucesso",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao remover usuário",
		});
	}
};
