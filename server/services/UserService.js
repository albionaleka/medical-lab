import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";

dotenv.config();
const SALT = parseInt(process.env.SALT) || 10;

export class UserService {
  static async register(fullName, email, password, role) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, SALT);

    const user = await User.create({
      fullName,
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
        fullName: user.fullName,
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
        fullName: user.fullName,
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
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000;
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
}
