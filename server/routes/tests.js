import express from "express";
import { TestPanelController } from "../controllers/TestPanelController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Create a new test panel with parameters
 *     tags: [Test Panels]
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
 *               - categoryId
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Complete Blood Count
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 75.00
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     unit:
 *                       type: string
 *                     minValue:
 *                       type: number
 *                     maxValue:
 *                       type: number
 *     responses:
 *       201:
 *         description: Test panel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestPanel'
 *       403:
 *         description: Forbidden - Admin or Laborant only
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.createTestPanel,
);

/**
 * @swagger
 * /tests:
 *   get:
 *     summary: Get all test panels
 *     tags: [Test Panels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all test panels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestPanel'
 */
router.get("/", authenticate, TestPanelController.getTestPanels);

/**
 * @swagger
 * /tests/{id}:
 *   put:
 *     summary: Update test panel
 *     tags: [Test Panels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test panel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Test panel updated successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Test panel not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.updateTestPanel,
);

/**
 * @swagger
 * /tests/{id}:
 *   delete:
 *     summary: Delete test panel
 *     tags: [Test Panels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test panel ID
 *     responses:
 *       200:
 *         description: Test panel deleted successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Test panel not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestPanelController.deleteTestPanel,
);

export default router;
