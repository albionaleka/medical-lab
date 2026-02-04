import express from "express";
import { TestResultController } from "../controllers/TestResultController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, TestResultController.createTestResult);
router.get("/", authenticate, TestResultController.getAllTestResults);

router.get(
  "/patient/:patientId",
  authenticate,
  TestResultController.getTestResultsByPatient,
);

router.get("/:id", authenticate, TestResultController.getTestResultById);
router.delete("/:id", authenticate, TestResultController.deleteTestResult);

export default router;
