import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";

export class ProfileService {
  static async createOrUpdateProfile(
    userId,
    firstName,
    lastName,
    birthDate,
    address,
    phone,
    jobTitle,
    profileImage
  ) {
    const profile = await Profile.findOne({ where: { userId } });

    if (profile) {
      await profile.update({
        firstName,
        lastName,
        birthDate,
        address,
        phone,
        jobTitle,
        profileImage,
      });
      return profile;
    }

    const newProfile = await Profile.create({
      userId,
      firstName,
      lastName,
      birthDate,
      address,
      phone,
      jobTitle,
      profileImage,
    });

    return newProfile;
  }

  static async getProfileByUserId(userId) {
    const profile = await Profile.findOne({
      where: { userId: Number(userId) },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["passwordHash", "reset_otp", "reset_otp_expires_at"],
          },
        },
      ],
    });

    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile;
  }
}
