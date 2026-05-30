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
		const { start, end } = req.query;

		let startDate: Date;
		let endDate: Date;

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

		const totalPets = await Pet.count({ where: { clinic_id } });

		const appointmentsThisMonth = await Appointment.count({
			where: {
				clinic_id,
				date: { [Op.between]: [startDate, endDate] },
			},
		});

		const upcomingVaccines = await Vaccine.count({
			where: {
				clinic_id,
				next_dose_date: { [Op.between]: [startDate, endDate] },
			},
		});

		return res.json({ totalPets, appointmentsThisMonth, upcomingVaccines });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erro ao carregar dashboard" });
	}
};
