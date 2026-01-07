import express from "express";
import { PatientService } from "../services/PatientService.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const {
      personalNumber,
      firstName,
      lastName,
      birthday,
      gender,
      phone,
      email,
    } = req.body;

    const newPatient = await PatientService.createPatient({
      personalNumber,
      firstName,
      lastName,
      birthday,
      gender,
      phone,
      email,
    });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
