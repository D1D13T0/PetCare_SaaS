import { Router } from "express";
import {
	createPet,
	deletePet,
	getPetById,
	listPets,
	updatePet,
} from "../controllers/petController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createPet);
router.get("/", authMiddleware, listPets);
router.get("/:id", authMiddleware, getPetById);
router.put("/:id", authMiddleware, updatePet);
router.delete("/:id", authMiddleware, deletePet);

export default router;
