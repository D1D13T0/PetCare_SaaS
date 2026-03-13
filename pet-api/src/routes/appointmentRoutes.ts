import { Router } from "express";
import {
	createAppointment,
	listAppointments,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, listAppointments);

export default router;
