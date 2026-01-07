import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    jobTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "user_profile",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    underscored: true,
  }
);
