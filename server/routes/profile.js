import express from "express";
import { ProfileService } from "../services/ProfileService.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      address,
      phone,
      jobTitle,
      profileImage,
    } = req.body;
    const userId = req.user.id;
    const profile = await ProfileService.createOrUpdateProfile(
      userId,
      firstName,
      lastName,
      birthDate,
      address,
      phone,
      jobTitle,
      profileImage
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.query.id;
    const profile = await ProfileService.getProfileByUserId(Number(userId), {
      attributes: {
        exclude: ["passwordHash", "reset_otp", "reset_otp_expires_at"],
      },
    });
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
