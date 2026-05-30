import { Router } from "express";
import { changePassword, googleLogin, login, register } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.patch("/password", authMiddleware, changePassword);

export default router;
