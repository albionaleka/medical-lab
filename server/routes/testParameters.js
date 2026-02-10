import express from "express";
import { TestParameterController } from "../controllers/TestParameterController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /parameters:
 *   post:
 *     summary: Create a new test parameter
 *     tags: [Test Parameters]
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
 *               - unit
 *               - panelId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hemoglobin
 *               unit:
 *                 type: string
 *                 example: g/dL
 *               panelId:
 *                 type: integer
 *                 example: 1
 *               referenceRanges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     gender:
 *                       type: string
 *                       enum: [Male, Female, Other]
 *                     minAge:
 *                       type: integer
 *                     maxAge:
 *                       type: integer
 *                     minValue:
 *                       type: number
 *                     maxValue:
 *                       type: number
 *     responses:
 *       201:
 *         description: Parameter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestParameter'
 *       403:
 *         description: Forbidden - Admin or Laborant only
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.createParameter,
);

/**
 * @swagger
 * /parameters/{id}:
 *   get:
 *     summary: Get test parameter by ID
 *     tags: [Test Parameters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parameter ID
 *     responses:
 *       200:
 *         description: Parameter details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestParameter'
 *       404:
 *         description: Parameter not found
 */
router.get("/:id", authenticate, TestParameterController.getParameterById);

/**
 * @swagger
 * /parameters/{id}:
 *   put:
 *     summary: Update test parameter
 *     tags: [Test Parameters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parameter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               referenceRanges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     gender:
 *                       type: string
 *                     minAge:
 *                       type: integer
 *                     maxAge:
 *                       type: integer
 *                     minValue:
 *                       type: number
 *                     maxValue:
 *                       type: number
 *     responses:
 *       200:
 *         description: Parameter updated successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Parameter not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.updateParameter,
);

/**
 * @swagger
 * /parameters/{id}:
 *   delete:
 *     summary: Delete test parameter
 *     tags: [Test Parameters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parameter ID
 *     responses:
 *       200:
 *         description: Parameter deleted successfully
 *       403:
 *         description: Forbidden - Admin or Laborant only
 *       404:
 *         description: Parameter not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "LABORANT"),
  TestParameterController.deleteParameter,
);

export default router;
