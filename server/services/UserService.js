import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";

dotenv.config();
const SALT = parseInt(process.env.SALT) || 10;

export class UserService {
  static async register(email, password, role) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, SALT);

    const user = await User.create({
      email,
      passwordHash,
      role,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async sendResetPasswordOTP(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User with this email does not exist");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_otp = otp;
    user.reset_otp_expires_at = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
      });
    } catch (error) {
      throw new Error("Failed to send OTP email");
    }

    return { message: "OTP sent to email" };
  }

  static async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User with this email does not exist");
    }

    if (
      user.reset_otp !== otp ||
      Date.now() > new Date(user.reset_otp_expires_at).getTime()
    ) {
      throw new Error("Invalid or expired OTP");
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT);
    user.passwordHash = passwordHash;
    user.reset_otp = null;
    user.reset_otp_expires_at = null;
    await user.save();

    return { user: { attributes: { exclude: ["passwordHash", "reset_otp", "reset_otp_expires_at"] } }, message: "Password has been reset successfully" };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["passwordHash", "reset_otp", "reset_otp_expires_at"],
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async getAllUsers() {
    const users = await User.findAll({
      attributes: {
        exclude: ["passwordHash", "reset_otp", "reset_otp_expires_at"],
      },
    });
    return users;
  }

  static async deleteUser(targetUserId, requester) {
    const user = await User.findByPk(targetUserId);

    if (!user) {
      throw new Error("User not found");
    }

    const isAdmin = requester.role === "ADMIN";
    const isSelf = requester.id === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new Error("You are not allowed to delete this user");
    }

    await user.destroy();
    return { message: "User deleted successfully" };
  }

  static async updateUser(targetUserId, updates, requester) {
    const user = await User.findByPk(targetUserId);

    if (!user) {
      throw new Error("User not found");
    }

    const isAdmin = requester.role === "ADMIN";
    // Only admin can update other users (or role)
    if (!isAdmin) {
      throw new Error("You are not allowed to update this user");
    }

    // If updating email, check for duplicates
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updates.email } });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
    }

    if (updates.email) user.email = updates.email;
    if (updates.role) user.role = updates.role;

    // Check if password update is requested (optional, but good to have)
    if (updates.password) {
      const passwordHash = await bcrypt.hash(updates.password, SALT);
      user.passwordHash = passwordHash;
    }

    await user.save();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
