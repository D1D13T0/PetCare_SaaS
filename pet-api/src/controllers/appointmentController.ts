import { Request, Response } from "express";
import { Op } from "sequelize";
import Appointment from "../models/appointments";
import Pet from "../models/pet";
import User from "../models/user";

export const createAppointment = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		if (req.user!.role !== "ADMIN") {
			return res.status(403).json({
				message: "Apenas ADMIN pode criar agendamentos",
			});
		}

		const { pet_id, veterinarian_id, date, diagnosis, notes } = req.body;

		if (!pet_id || !veterinarian_id || !date) {
			return res.status(400).json({
				message: "pet_id, veterinarian_id e date são obrigatórios",
			});
		}

		const pet = await Pet.findByPk(pet_id);
		if (!pet || pet.clinic_id !== req.user!.clinic_id) {
			return res.status(400).json({
				message: "Pet inválido para esta clínica",
			});
		}

		const vet = await User.findByPk(veterinarian_id);
		if (!vet || vet.clinic_id !== req.user!.clinic_id) {
			return res.status(400).json({
				message: "Veterinário inválido para esta clínica",
			});
		}

		const appointment = await Appointment.create({
			clinic_id: req.user!.clinic_id,
			pet_id,
			veterinarian_id,
			date,
			diagnosis,
			notes,
		});

		return res.status(201).json(appointment);
	} catch (error: any) {
		console.error("ERRO CREATE APPOINTMENT:", error);
		return res.status(500).json({
			message: "Erro ao criar agendamento",
			error: error.message,
		});
	}
};

export const listAppointments = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const { start, end } = req.query;

		const whereClause: any = {
			clinic_id: req.user!.clinic_id,
		};

		if (start && end) {
			whereClause.date = {
				[Op.between]: [new Date(start as string), new Date(end as string)],
			};
		}

		const appointments = await Appointment.findAll({
			where: whereClause,
			order: [["date", "ASC"]],
		});

		return res.json(appointments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao listar agendamentos",
		});
	}
};

export const completeAppointment = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { diagnosis, notes } = req.body;

		const appointment = await Appointment.findByPk(id);

		if (!appointment) {
			return res.status(404).json({ message: "Agendamento não encontrado" });
		}

		if (appointment.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		if (req.user!.role !== "ADMIN") {
			return res
				.status(403)
				.json({ message: "Apenas ADMIN pode finalizar consulta" });
		}

		await appointment.update({
			diagnosis,
			notes,
			status: "COMPLETED",
		});

		return res.json(appointment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao finalizar consulta",
		});
	}
};

export const listAppointmentsByPet = async (req: Request, res: Response) => {
	try {
		const { pet_id } = req.params;

		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const pet = await Pet.findByPk(pet_id);

		if (!pet || pet.clinic_id !== req.user!.clinic_id) {
			return res.status(404).json({
				message: "Pet não encontrado para esta clínica",
			});
		}

		const appointments = await Appointment.findAll({
			where: {
				clinic_id: req.user!.clinic_id,
				pet_id,
			},
			order: [["date", "ASC"]],
		});

		return res.json(appointments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao listar consultas por pet",
		});
	}
};
