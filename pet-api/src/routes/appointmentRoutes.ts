import { Router } from "express";
import {
	completeAppointment,
	createAppointment,
	listAppointments,
	listAppointmentsByPet,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, listAppointments);
router.patch("/:id/complete", authMiddleware, completeAppointment);
router.get("/pet/:pet_id", authMiddleware, listAppointmentsByPet);
export default router;
