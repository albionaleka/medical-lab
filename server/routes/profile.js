import express from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, ProfileController.createOrUpdateProfile);
router.get("/", authenticate, ProfileController.getProfile);
router.get(
  "/all",
  authenticate,
  authorize("ADMIN"),
  ProfileController.getAllProfiles,
);

export default router;
