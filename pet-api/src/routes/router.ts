import { Router } from "express";
import appointmentRoutes from "./appointmentRoutes";
import authRoutes from "./authRoutes";
import clinicRoutes from "./clinicRoutes";
import dashboardRoutes from "./dashboardRoutes";
import ownerRoutes from "./ownerRoutes";
import petRoutes from "./petRoutes";
import vaccineRoutes from "./vaccineRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pets", petRoutes);
router.use("/clinic", clinicRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/owners", ownerRoutes);
router.use("/vaccines", vaccineRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
