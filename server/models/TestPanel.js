import DataTypes from "sequelize";
import sequelize from "../config/database.js";

const TestPanel = sequelize.define(
  "TestPanel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "test_panels",
    timestamps: false,
  }
);

export default TestPanel;
