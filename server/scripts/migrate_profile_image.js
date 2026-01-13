import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const migrateProfileImage = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.changeColumn("user_profile", "profile_image", {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        });

        console.log("Successfully changed profile_image column to LONGTEXT.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await sequelize.close();
    }
};

migrateProfileImage();
