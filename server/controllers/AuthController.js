import { UserService } from "../services/UserService.js";

export const AuthController = {
    async register(req, res) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const result = await UserService.register(email, password, role);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const result = await UserService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    async resetOtp(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            await UserService.sendResetPasswordOTP(email);
            res.json({ message: "Password reset email sent" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                return res
                    .status(400)
                    .json({ error: "Email, OTP, and new password are required" });
            }

            const result = await UserService.resetPassword(email, otp, newPassword);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getMe(req, res) {
        try {
            const userId = req.user.id;
            const user = await UserService.getUserById(userId);
            res.json({
                id: user.id,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const targetUserId = Number(req.params.id);
            const requester = req.user;

            const result = await UserService.deleteUser(targetUserId, requester);
            res.json(result);
        } catch (error) {
            res.status(403).json({ error: error.message });
        }
    },
};
