import { TestCategoryController } from "../controllers/TestCategoryController.js";
import express from "express";

const router = express.Router();

router.post("/", TestCategoryController.createCategory);
router.get("/", TestCategoryController.getAllCategories);
router.get("/:id", TestCategoryController.getCategoryById);
router.put("/:id", TestCategoryController.updateCategory);
router.delete("/:id", TestCategoryController.deleteCategory);

export default router;
