import express from "express";
import { TestPanelController } from "../controllers/TestPanelController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.createTestPanel,
);
router.get("/", authenticate, TestPanelController.getTestPanels);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.updateTestPanel,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.deleteTestPanel,
);

export default router;
