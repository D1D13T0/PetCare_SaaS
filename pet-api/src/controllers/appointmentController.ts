import { Request, Response } from "express";
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

		const { pet_id, veterinarian_id, date, notes } = req.body;

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
			notes,
		});

		return res.status(201).json(appointment);
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao criar agendamento",
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

		const appointments = await Appointment.findAll({
			where: { clinic_id: req.user!.clinic_id },
			include: [{ model: Pet }, { model: User, as: "User" }],
			order: [["date", "ASC"]],
		});

		return res.json(appointments);
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao listar agendamentos",
		});
	}
};
