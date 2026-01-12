import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/reset-otp", AuthController.resetOtp);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", authenticate, AuthController.getMe);
router.get("/", authenticate, authorize("ADMIN"), AuthController.getAllUsers);
router.delete("/:id", authenticate, AuthController.deleteUser);

export default router;
