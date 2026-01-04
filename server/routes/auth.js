import express from "express";
import { UserService } from "../services/UserService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await UserService.register(fullName, email, password, role);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await UserService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await UserService.sendResetPasswordOTP(email);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
