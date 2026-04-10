import { Request, Response } from "express";
import { validate as isUUID } from "uuid";
import Owner from "../models/owner";
import Pet from "../models/pet";

export const createPet = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const { owner_id, name, species, breed, birth_date } = req.body;

		if (!owner_id || !name || !species) {
			return res.status(400).json({
				message: "owner_id, name e species são obrigatórios",
			});
		}

		const owner = await Owner.findByPk(owner_id);

		if (!owner || owner.clinic_id !== req.user.clinic_id) {
			return res.status(400).json({
				message: "Dono inválido para esta clínica",
			});
		}

		const pet = await Pet.create({
			clinic_id: req.user.clinic_id,
			owner_id,
			name,
			species,
			breed,
			birth_date,
		});

		return res.status(201).json(pet);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao criar pet",
		});
	}
};

export const listPets = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const pets = await Pet.findAll({
			where: { clinic_id: req.user.clinic_id },
		});

		return res.json(pets);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao listar pets" });
	}
};

export const getPetById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!isUUID(id)) {
			return res.status(400).json({ message: "ID inválido" });
		}

		const pet = await Pet.findByPk(id);

		if (!pet) {
			return res.status(404).json({ message: "Pet não encontrado" });
		}

		if (pet.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		return res.json(pet);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao buscar pet" });
	}
};

export const updatePet = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const pet = await Pet.findByPk(id);

		if (!pet) {
			return res.status(404).json({ message: "Pet não encontrado" });
		}

		if (pet.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		await pet.update(req.body);

		return res.json(pet);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao atualizar pet" });
	}
};

export const deletePet = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const pet = await Pet.findByPk(id);

		if (!pet) {
			return res.status(404).json({ message: "Pet não encontrado" });
		}

		if (pet.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		await pet.destroy();

		return res.json({ message: "Pet removido com sucesso" });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao deletar pet" });
	}
};
