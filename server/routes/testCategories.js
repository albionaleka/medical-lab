import { TestCategoryService } from "../services/TestCategoryService.js";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const category = await TestCategoryService.createCategory(
      name,
      description
    );
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
