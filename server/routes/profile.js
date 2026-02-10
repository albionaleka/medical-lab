import express from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create or update current user profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 example: Experienced laboratory technician
 *     responses:
 *       200:
 *         description: Profile created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 */
router.post("/", authenticate, ProfileController.createOrUpdateProfile);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.get("/", authenticate, ProfileController.getProfile);

/**
 * @swagger
 * /profile/all:
 *   get:
 *     summary: Get all user profiles (Admin only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/all",
  authenticate,
  authorize("ADMIN"),
  ProfileController.getAllProfiles,
);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update any user profile (Admin only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Profile ID
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
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Profile not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  ProfileController.updateUserProfile,
);

export default router;
