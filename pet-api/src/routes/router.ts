import { Router } from "express";
import appointmentRoutes from "./appointmentRoutes";
import authRoutes from "./authRoutes";
import clinicRoutes from "./clinicRoutes";
import ownerRoutes from "./ownerRoutes";
import petRoutes from "./petRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pets", petRoutes);
router.use("/clinic", clinicRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/owners", ownerRoutes);

export default router;
