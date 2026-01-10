import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "test_categories",
    timestamps: false,
  }
);

export default TestCategory;
