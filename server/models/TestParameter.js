import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TestParameter = sequelize.define(
  "TestParameter",
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
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    panelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "test_parameters",
    underscored: true,
    timestamps: false,
  }
);

export default TestParameter;
