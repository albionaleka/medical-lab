import express from "express";
import { TestPanelController } from "../controllers/TestPanelController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, TestPanelController.createTestPanel);

export default router;
