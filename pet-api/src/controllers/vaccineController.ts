import { Request, Response } from "express";
import { Op } from "sequelize";
import Pet from "../models/pet";
import Vaccine from "../models/vaccine";

export const createVaccine = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const { pet_id, name, application_date, next_dose_date, notes } = req.body;

		if (!pet_id || !name || !application_date) {
			return res.status(400).json({
				message: "pet_id, name e application_date são obrigatórios",
			});
		}

		const pet = await Pet.findByPk(pet_id);

		if (!pet || pet.clinic_id !== req.user.clinic_id) {
			return res.status(404).json({
				message: "Pet não encontrado para esta clínica",
			});
		}

		const vaccine = await Vaccine.create({
			clinic_id: req.user.clinic_id,
			pet_id,
			name,
			application_date,
			next_dose_date,
			notes,
		});

		return res.status(201).json(vaccine);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao registrar vacina",
		});
	}
};

export const listVaccinesByPet = async (req: Request, res: Response) => {
	try {
		const { pet_id } = req.params;

		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const vaccines = await Vaccine.findAll({
			where: {
				clinic_id: req.user.clinic_id,
				pet_id,
			},
			order: [["application_date", "DESC"]],
		});

		return res.json(vaccines);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao listar vacinas",
		});
	}
};

export const getUpcomingVaccines = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const today = new Date();
		const futureDate = new Date();
		futureDate.setDate(today.getDate() + 7); // próximos 7 dias

		const vaccines = await Vaccine.findAll({
			where: {
				clinic_id: req.user.clinic_id,
				next_dose_date: {
					[Op.between]: [today, futureDate],
				},
			},
			order: [["next_dose_date", "ASC"]],
		});

		return res.json(vaccines);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao buscar vacinas próximas",
		});
	}
};
