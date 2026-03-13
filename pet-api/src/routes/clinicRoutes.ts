import { Router } from "express";
import {
	createClinic,
	getClinic,
	inviteUserToClinic,
	listClinicUsers,
	removeUserFromClinic,
	updateClinic,
} from "../controllers/clinicController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createClinic);
router.get("/", authMiddleware, getClinic);
router.put("/", authMiddleware, updateClinic);
router.post("/invite", authMiddleware, inviteUserToClinic);
router.get("/users", authMiddleware, listClinicUsers);
router.delete("/users/:userId", authMiddleware, removeUserFromClinic);

export default router;
