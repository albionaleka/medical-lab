import DataTypes from "sequelize";
import sequelize from "../config/database.js";

const TestResult = sequelize.define(
  "TestResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    panelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    testedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "test_results",
    timestamps: true,
    underscored: true,
  }
);

export default TestResult;
