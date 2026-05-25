import { Router } from "express";
import {
	createVaccine,
	deleteVaccine,
	getUpcomingVaccines,
	listVaccinesByPet,
	updateVaccine,
} from "../controllers/vaccineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createVaccine);
router.get("/pet/:pet_id", authMiddleware, listVaccinesByPet);
router.get("/upcoming", authMiddleware, getUpcomingVaccines);
router.put("/:id", authMiddleware, updateVaccine);
router.delete("/:id", authMiddleware, deleteVaccine);

export default router;
