import { Request, Response } from "express";
import { Op } from "sequelize";
import Owner from "../models/owner";
import Pet from "../models/pet";

export const createOwner = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const { name, email, phone, document } = req.body;

		if (!name) {
			return res.status(400).json({
				message: "Nome é obrigatório",
			});
		}

		const owner = await Owner.create({
			clinic_id: req.user.clinic_id,
			name,
			email,
			phone,
			document,
		});

		return res.status(201).json(owner);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao criar dono",
		});
	}
};

export const listOwners = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const { search } = req.query;

		const where: any = {
			clinic_id: req.user.clinic_id,
		};

		if (search) {
			where.name = {
				[Op.iLike]: `%${search}%`,
			};
		}

		const owners = await Owner.findAll({
			where,
			order: [["createdAt", "DESC"]],
		});

		return res.json(owners);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao listar donos",
		});
	}
};

export const updateOwner = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const owner = await Owner.findByPk(id);

		if (!owner) {
			return res.status(404).json({
				message: "Dono não encontrado",
			});
		}

		if (owner.clinic_id !== req.user.clinic_id) {
			return res.status(403).json({
				message: "Acesso negado",
			});
		}

		await owner.update(req.body);

		return res.json(owner);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao atualizar dono",
		});
	}
};

export const deleteOwner = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const owner = await Owner.findByPk(id);

		if (!owner) {
			return res.status(404).json({
				message: "Dono não encontrado",
			});
		}

		if (owner.clinic_id !== req.user.clinic_id) {
			return res.status(403).json({
				message: "Acesso negado",
			});
		}

		const petCount = await Pet.count({
			where: { owner_id: id },
		});

		if (petCount > 0) {
			return res.status(400).json({
				message: "Não é possível excluir dono com pets cadastrados",
			});
		}

		await owner.destroy();

		return res.json({
			message: "Dono removido com sucesso",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao excluir dono",
		});
	}
};
