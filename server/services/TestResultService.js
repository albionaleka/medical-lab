import {
  TestResult,
  TestResultValues,
  TestPanel,
  TestParameter,
  Patient,
} from "../models/index.js";
import sequelize from "../config/database.js";

export const TestResultService = {
  async createTestResult(data) {
    const t = await sequelize.transaction();
    try {
      const { patientId, panelId, values } = data;

      const testResult = await TestResult.create(
        {
          patientId,
          panelId,
          testedAt: new Date(),
        },
        { transaction: t },
      );

      if (values && values.length > 0) {
        for (const val of values) {
          await TestResultValues.create(
            {
              testResultId: testResult.id,
              parameterId: val.parameterId,
              resultValue: val.value,
              resultStatus: val.status || "NORMAL",
            },
            { transaction: t },
          );
        }
      }

      await t.commit();
      return testResult;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async getTestResultsByPatientId(patientId) {
    return await TestResult.findAll({
      where: { patientId },
      include: [
        {
          model: TestPanel,
          as: "panel",
          include: [
            {
              model: TestParameter,
              as: "parameters",
              include: ["referenceRanges"],
            },
          ],
        },
        {
          model: TestResultValues,
          as: "values",
          include: [
            {
              model: TestParameter,
              as: "parameter",
              include: ["referenceRanges"],
            },
          ],
        },
      ],
      order: [["testedAt", "DESC"]],
    });
  },

  async getAllTestResults() {
    return await TestResult.findAll({
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "personalNumber"],
        },
        {
          model: TestPanel,
          as: "panel",
          include: [
            {
              model: TestParameter,
              as: "parameters",
              include: ["referenceRanges"],
            },
          ],
        },
        {
          model: TestResultValues,
          as: "values",
          include: [
            {
              model: TestParameter,
              as: "parameter",
              include: ["referenceRanges"],
            },
          ],
        },
      ],
      order: [["testedAt", "DESC"]],
    });
  },

  async getTestResultById(id) {
    return await TestResult.findByPk(id, {
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "personalNumber",
            "birthday",
            "gender",
          ],
        },
        {
          model: TestPanel,
          as: "panel",
          include: [
            {
              model: TestParameter,
              as: "parameters",
              include: ["referenceRanges"],
            },
          ],
        },
        {
          model: TestResultValues,
          as: "values",
          include: [
            {
              model: TestParameter,
              as: "parameter",
              include: ["referenceRanges"],
            },
          ],
        },
      ],
    });
  },

  async deleteTestResult(id) {
    const t = await sequelize.transaction();
    try {
      await TestResultValues.destroy({
        where: { testResultId: id },
        transaction: t,
      });

      const result = await TestResult.destroy({
        where: { id },
        transaction: t,
      });

      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};
