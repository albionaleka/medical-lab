import express from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, ProfileController.createOrUpdateProfile);
router.get("/", authenticate, ProfileController.getProfile);

export default router;
