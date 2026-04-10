import { Router } from "express";
import {
	createOwner,
	deleteOwner,
	listOwners,
	updateOwner,
} from "../controllers/ownerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createOwner);
router.get("/", authMiddleware, listOwners);
router.put("/:id", authMiddleware, updateOwner);
router.delete("/:id", authMiddleware, deleteOwner);

export default router;
