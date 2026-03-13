import { Router } from "express";
import appointmentRoutes from "./appointmentRoutes";
import authRoutes from "./authRoutes";
import clinicRoutes from "./clinicRoutes";
import petRoutes from "./petRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pets", petRoutes);
router.use("/clinic", clinicRoutes);
router.use("/appointments", appointmentRoutes);

export default router;
