import { TestCategoryController } from "../controllers/TestCategoryController.js";
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.createCategory,
);

router.get("/", authenticate, TestCategoryController.getAllCategories);

router.get("/:id", authenticate, TestCategoryController.getCategoryById);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.updateCategory,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.deleteCategory,
);

export default router;
