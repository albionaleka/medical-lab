import express from "express";
import { PatientController } from "../controllers/PatientController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, PatientController.createPatient);
router.get("/:id", authenticate, PatientController.getPatientById);
router.get("/", authenticate, PatientController.getAllPatients);
router.put("/:id", authenticate, PatientController.updatePatient);
router.delete("/:id", authenticate, PatientController.deletePatient);

export default router;
