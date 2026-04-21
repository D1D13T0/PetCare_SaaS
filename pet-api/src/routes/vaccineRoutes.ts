import { Router } from "express";
import {
	createVaccine,
	getUpcomingVaccines,
	listVaccinesByPet,
} from "../controllers/vaccineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createVaccine);
router.get("/pet/:pet_id", authMiddleware, listVaccinesByPet);
router.get("/upcoming", authMiddleware, getUpcomingVaccines);

export default router;
