import express from "express";
import { TestPanelController } from "../controllers/TestPanelController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, TestPanelController.createTestPanel);
router.get("/", authenticate, TestPanelController.getTestPanels);
router.put("/:id", authenticate, TestPanelController.updateTestPanel);
router.delete("/:id", authenticate, TestPanelController.deleteTestPanel);

export default router;
