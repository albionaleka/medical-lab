import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ReferenceRanges = sequelize.define(
  "ReferenceRanges",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parameterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      allowNull: true,
    },
    normalMin: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    normalMax: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "reference_ranges",
    underscored: true,
    timestamps: false,
  }
);

export default ReferenceRanges;
