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

		const { pet_id, veterinarian_id, date, diagnosis, notes, valor } = req.body;

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
			valor,
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

export const getFinancialReport = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({ message: "Você não pertence a nenhuma clínica" });
		}

		const { start, end } = req.query;
		let startDate: Date, endDate: Date;

		if (start && end) {
			startDate = new Date(start as string);
			endDate = new Date(end as string);
			endDate.setHours(23, 59, 59, 999);
		} else {
			startDate = new Date();
			startDate.setDate(1);
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 1);
			endDate.setDate(0);
			endDate.setHours(23, 59, 59, 999);
		}

		const appointments = await Appointment.findAll({
			where: {
				clinic_id: req.user!.clinic_id,
				status: "COMPLETED",
				date: { [Op.between]: [startDate, endDate] },
			},
			include: [{ model: Pet, attributes: ["id", "name"] }],
			order: [["date", "DESC"]],
		});

		const total = appointments.reduce((sum, a) => sum + (Number(a.valor) || 0), 0);

		return res.json({ appointments, total, count: appointments.length });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erro ao gerar relatório financeiro" });
	}
};

export const cancelAppointment = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const appointment = await Appointment.findByPk(id as string);

		if (!appointment) {
			return res.status(404).json({ message: "Agendamento não encontrado" });
		}

		if (appointment.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		if (appointment.status === "COMPLETED" || appointment.status === "CANCELLED") {
			return res.status(400).json({ message: "Agendamento não pode ser cancelado" });
		}

		await appointment.update({ status: "CANCELLED" });

		return res.json(appointment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erro ao cancelar agendamento" });
	}
};

export const listAppointments = async (req: Request, res: Response) => {
	try {
		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const { start, end, limit, offset } = req.query;

		const whereClause: any = { clinic_id: req.user!.clinic_id };

		if (start && end) {
			whereClause.date = {
				[Op.between]: [new Date(start as string), new Date(end as string)],
			};
		}

		const appointments = await Appointment.findAll({
			where: whereClause,
			limit: limit ? parseInt(limit as string) : 10,
			offset: offset ? parseInt(offset as string) : 0,
			order: [["date", "DESC"]],
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
		const { diagnosis, notes, valor } = req.body;

		const appointment = await Appointment.findByPk(id as string);

		if (!appointment) {
			return res.status(404).json({ message: "Agendamento não encontrado" });
		}

		if (appointment.clinic_id !== req.user!.clinic_id) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		await appointment.update({
			diagnosis,
			notes,
			valor,
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
		const { start, end } = req.query;

		if (!req.user!.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const pet = await Pet.findByPk(pet_id as string);

		if (!pet || pet.clinic_id !== req.user!.clinic_id) {
			return res.status(404).json({
				message: "Pet não encontrado para esta clínica",
			});
		}

		const whereClause: any = {
			clinic_id: req.user!.clinic_id,
			pet_id,
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
			message: "Erro ao listar consultas por pet",
		});
	}
};
