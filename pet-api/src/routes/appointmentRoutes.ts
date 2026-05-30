import { Router } from "express";
import {
	cancelAppointment,
	completeAppointment,
	createAppointment,
	getFinancialReport,
	listAppointments,
	listAppointmentsByPet,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, listAppointments);
router.get("/report", authMiddleware, getFinancialReport);
router.patch("/:id/complete", authMiddleware, completeAppointment);
router.patch("/:id/cancel", authMiddleware, cancelAppointment);
router.get("/pet/:pet_id", authMiddleware, listAppointmentsByPet);
export default router;
