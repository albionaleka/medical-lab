import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TestResultValues = sequelize.define(
  "TestResultValues",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    testResultId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parameterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resultValue: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    resultStatus: {
      type: DataTypes.ENUM("LOW", "NORMAL", "HIGH"),
      allowNull: false,
    },
  },
  {
    tableName: "test_result_values",
    timestamps: false,
    underscored: true,
  }
);

export default TestResultValues;
