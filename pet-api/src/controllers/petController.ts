import { Request, Response } from "express";
import { validate as isUUID } from "uuid";
import Pet from "../models/pet";

export const createPet = async (req: Request, res: Response) => {
	try {
		const { name, species, breed, birth_date } = req.body;

		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Usuário não pertence a nenhuma clínica",
			});
		}

		const pet = await Pet.create({
			name,
			species,
			breed,
			birth_date,
			user_id: req.user!.id,
			clinic_id: req.user!.clinic_id,
		});

		return res.status(201).json(pet);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao criar pet" });
	}
};

export const listPets = async (req: Request, res: Response) => {
	try {
		const isAdmin = req.user!.role === "ADMIN";

		const pets = await Pet.findAll({
			where: { clinic_id: req.user!.clinic_id },
		});
		return res.json(pets);
	} catch (error) {
		return res.status(500).json({ message: "Erro ao listar pets" });
	}
};

export const getPetById = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!isUUID(id)) {
		return res.status(400).json({ message: "ID inválido" });
	}

	const pet = await Pet.findByPk(id);

	if (!pet) {
		return res.status(404).json({ message: "Pet não encontrado" });
	}

	if (req.user!.role !== "ADMIN" && pet.user_id !== req.user!.id) {
		return res.status(403).json({ message: "Acesso negado" });
	}

	return res.json(pet);
};

export const updatePet = async (req: Request, res: Response) => {
	try {
		const pet = await Pet.findByPk(req.params.id);

		if (!pet) {
			return res.status(404).json({ message: "Pet não encontrado" });
		}

		if (req.user!.role !== "ADMIN" && pet.user_id !== req.user!.id) {
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
		const pet = await Pet.findByPk(req.params.id);

		if (!pet) {
			return res.status(404).json({ message: "Pet não encontrado" });
		}

		if (req.user!.role !== "ADMIN" && pet.user_id !== req.user!.id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		await pet.destroy();

		return res.json({ message: "Pet removido com sucesso" });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao deletar pet" });
	}
};
