import express from "express";
import { TestResultController } from "../controllers/TestResultController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /test-results:
 *   post:
 *     summary: Create a new test result
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - panelId
 *               - values
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               panelId:
 *                 type: integer
 *                 example: 1
 *               values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     parameterId:
 *                       type: integer
 *                       example: 1
 *                     value:
 *                       type: number
 *                       example: 14.5
 *                     status:
 *                       type: string
 *                       example: Normal
 *     responses:
 *       201:
 *         description: Test result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestResult'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Laborant or Admin only
 */
router.post(
  "/",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.createTestResult,
);

/**
 * @swagger
 * /test-results:
 *   get:
 *     summary: Get all test results
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all test results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestResult'
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, TestResultController.getAllTestResults);

/**
 * @swagger
 * /test-results/patient/{patientId}:
 *   get:
 *     summary: Get test results by patient ID
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of test results for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestResult'
 *       500:
 *         description: Server error
 */
router.get(
  "/patient/:patientId",
  authenticate,
  TestResultController.getTestResultsByPatient,
);

/**
 * @swagger
 * /test-results/{id}:
 *   get:
 *     summary: Get test result by ID
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test result ID
 *     responses:
 *       200:
 *         description: Test result details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestResult'
 *       404:
 *         description: Test result not found
 */
router.get("/:id", authenticate, TestResultController.getTestResultById);

/**
 * @swagger
 * /test-results/{id}/download:
 *   get:
 *     summary: Download test result report as PDF
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test result ID
 *     responses:
 *       200:
 *         description: PDF report
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Test result not found
 */
router.get("/:id/download", authenticate, TestResultController.downloadReport);

/**
 * @swagger
 * /test-results/{id}:
 *   put:
 *     summary: Update test result
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test result ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - values
 *             properties:
 *               values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     parameterId:
 *                       type: integer
 *                     value:
 *                       type: number
 *                     status:
 *                       type: string
 *     responses:
 *       200:
 *         description: Test result updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Laborant or Admin only
 *       404:
 *         description: Test result not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.updateTestResult,
);

/**
 * @swagger
 * /test-results/{id}:
 *   delete:
 *     summary: Delete test result
 *     tags: [Test Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test result ID
 *     responses:
 *       200:
 *         description: Test result deleted successfully
 *       403:
 *         description: Forbidden - Laborant or Admin only
 *       404:
 *         description: Test result not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  TestResultController.deleteTestResult,
);

export default router;
