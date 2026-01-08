import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const TestCategory = sequelize.define(
  "TestCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "test_categories",
    timestamps: true,
  }
);

export default TestCategory;
