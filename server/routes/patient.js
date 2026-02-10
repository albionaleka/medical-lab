import express from "express";
import { PatientController } from "../controllers/PatientController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /patient:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personalNumber
 *               - firstName
 *               - lastName
 *               - phone
 *               - email
 *             properties:
 *               personalNumber:
 *                 type: string
 *                 example: "1234567890"
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Johnson
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Female
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice.johnson@example.com
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Forbidden - Laborant or Admin only
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  PatientController.createPatient,
);

/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, PatientController.getAllPatients);

/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */
router.get("/:id", authenticate, PatientController.getPatientById);

/**
 * @swagger
 * /patient/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Forbidden - Laborant or Admin only
 *       404:
 *         description: Patient not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("LABORANT", "ADMIN"),
  PatientController.updatePatient,
);

/**
 * @swagger
 * /patient/{id}:
 *   delete:
 *     summary: Delete patient (Admin only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Patient not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  PatientController.deletePatient,
);

export default router;
