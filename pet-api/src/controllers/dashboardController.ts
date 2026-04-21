import { Request, Response } from "express";
import { Op } from "sequelize";
import Appointment from "../models/appointments";
import Pet from "../models/pet";
import Vaccine from "../models/vaccine";

export const getDashboard = async (req: Request, res: Response) => {
	try {
		if (!req.user?.clinic_id) {
			return res.status(400).json({
				message: "Você não pertence a nenhuma clínica",
			});
		}

		const clinic_id = req.user.clinic_id;

		// 📌 Total de pets
		const totalPets = await Pet.count({
			where: { clinic_id },
		});

		// 📌 Consultas do mês atual
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const endOfMonth = new Date();
		endOfMonth.setMonth(endOfMonth.getMonth() + 1);
		endOfMonth.setDate(0);
		endOfMonth.setHours(23, 59, 59, 999);

		const appointmentsThisMonth = await Appointment.count({
			where: {
				clinic_id,
				date: {
					[Op.between]: [startOfMonth, endOfMonth],
				},
			},
		});

		// 📌 Vacinas próximas (7 dias)
		const today = new Date();
		const futureDate = new Date();
		futureDate.setDate(today.getDate() + 7);

		const upcomingVaccines = await Vaccine.count({
			where: {
				clinic_id,
				next_dose_date: {
					[Op.between]: [today, futureDate],
				},
			},
		});

		return res.json({
			totalPets,
			appointmentsThisMonth,
			upcomingVaccines,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Erro ao carregar dashboard",
		});
	}
};
