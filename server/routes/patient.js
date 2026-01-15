import express from "express";
import { PatientController } from "../controllers/PatientController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  PatientController.createPatient
);

router.get("/:id", authenticate, PatientController.getPatientById);

router.get("/", authenticate, PatientController.getAllPatients);

router.put(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  PatientController.updatePatient
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  PatientController.deletePatient
);

export default router;
