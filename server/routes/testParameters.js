import express from "express";
import { TestParameterController } from "../controllers/TestParameterController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.createParameter,
);
router.get("/:id", authenticate, TestParameterController.getParameterById);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.updateParameter,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.deleteParameter,
);

export default router;
