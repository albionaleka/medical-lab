import express from "express";
import { TestResultController } from "../controllers/TestResultController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, TestResultController.createTestResult);
router.get("/:patientId", authenticate, TestResultController.getTestResultsByPatient);

export default router;
