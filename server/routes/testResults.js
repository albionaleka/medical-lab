import express from "express";
import { TestResultController } from "../controllers/TestResultController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.createTestResult,
);
router.get("/", authenticate, TestResultController.getAllTestResults);

router.get(
  "/patient/:patientId",
  authenticate,
  TestResultController.getTestResultsByPatient,
);

router.get("/:id", authenticate, TestResultController.getTestResultById);
router.get("/:id/download", authenticate, TestResultController.downloadReport);
router.put(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.updateTestResult,
);
router.delete(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.deleteTestResult,
);

export default router;
