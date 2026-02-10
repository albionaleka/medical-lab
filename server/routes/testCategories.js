import { TestCategoryController } from "../controllers/TestCategoryController.js";
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new test category
 *     tags: [Test Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Blood Chemistry
 *               description:
 *                 type: string
 *                 example: Tests related to blood chemistry analysis
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCategory'
 *       403:
 *         description: Forbidden - Admin or Laborant only
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.createCategory,
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all test categories
 *     tags: [Test Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all test categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestCategory'
 */
router.get("/", authenticate, TestCategoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get test category by ID
 *     tags: [Test Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCategory'
 *       404:
 *         description: Category not found
 */
router.get("/:id", authenticate, TestCategoryController.getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update test category
 *     tags: [Test Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Category not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete test category
 *     tags: [Test Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestCategoryController.deleteCategory,
);

export default router;
