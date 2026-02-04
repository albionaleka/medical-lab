import {
  TestResult,
  TestResultValues,
  TestPanel,
  TestParameter,
  TestCategory,
  Patient,
} from "../models/index.js";
import sequelize from "../config/database.js";
import PDFDocument from "pdfkit";

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
              model: TestCategory,
              as: "category",
              attributes: ["id", "name", "price"],
            },
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

  async updateTestResult(id, data) {
    const t = await sequelize.transaction();
    try {
      const { values } = data;

      const testResult = await TestResult.findByPk(id);
      if (!testResult) {
        throw new Error("Test result not found");
      }

      if (values && values.length > 0) {
        await TestResultValues.destroy({
          where: { testResultId: id },
          transaction: t,
        });

        for (const val of values) {
          await TestResultValues.create(
            {
              testResultId: id,
              parameterId: val.parameterId,
              resultValue: val.value,
              resultStatus: val.status || "NORMAL",
            },
            { transaction: t },
          );
        }
      }

      await t.commit();
      return this.getTestResultById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async generatePDFReport(id) {
    const testResult = await this.getTestResultById(id);

    if (!testResult) {
      throw new Error("Test result not found");
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        doc
          .fontSize(20)
          .text("Laboratory Test Results Report", { align: "center" });
        doc.moveDown();
        doc
          .fontSize(10)
          .text(`Report Date: ${new Date().toLocaleDateString()}`, {
            align: "right",
          });
        doc.moveDown(2);

        doc.fontSize(14).text("Patient Information", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text(
          `Name: ${testResult.patient.firstName} ${testResult.patient.lastName}`,
        );
        doc.text(`Personal Number: ${testResult.patient.personalNumber}`);
        if (testResult.patient.birthday) {
          doc.text(
            `Date of Birth: ${new Date(testResult.patient.birthday).toLocaleDateString()}`,
          );
        }
        if (testResult.patient.gender) {
          doc.text(`Gender: ${testResult.patient.gender}`);
        }
        doc.moveDown(2);

        doc.fontSize(14).text("Test Information", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text(`Test Panel: ${testResult.panel.name}`);
        doc.text(
          `Test Date: ${new Date(testResult.testedAt).toLocaleDateString()}`,
        );
        doc.moveDown(2);

        doc.fontSize(14).text("Test Results", { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const cols = {
          parameter: { x: 50, width: 180 },
          value: { x: 240, width: 70 },
          unit: { x: 320, width: 70 },
          range: { x: 400, width: 100 },
          status: { x: 510, width: 60 },
        };

        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Parameter", cols.parameter.x, tableTop, {
          width: cols.parameter.width,
          align: "left",
        });
        doc.text("Value", cols.value.x, tableTop, {
          width: cols.value.width,
          align: "center",
        });
        doc.text("Unit", cols.unit.x, tableTop, {
          width: cols.unit.width,
          align: "center",
        });
        doc.text("Reference Range", cols.range.x, tableTop, {
          width: cols.range.width,
          align: "center",
        });
        doc.text("Status", cols.status.x, tableTop, {
          width: cols.status.width,
          align: "center",
        });

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(570, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font("Helvetica");
        testResult.values.forEach((value, index) => {
          const y = doc.y;
          const parameter = value.parameter;

          let rangeText = "-";
          if (
            parameter.referenceRanges &&
            parameter.referenceRanges.length > 0
          ) {
            const range = parameter.referenceRanges[0];
            if (range.normalMin && range.normalMax) {
              rangeText = `${range.normalMin} - ${range.normalMax}`;
            }
          }

          let statusColor = "black";
          if (value.resultStatus === "HIGH") statusColor = "red";
          else if (value.resultStatus === "LOW") statusColor = "orange";

          doc.fontSize(9);
          doc.fillColor("black").text(parameter.name, cols.parameter.x, y, {
            width: cols.parameter.width,
            align: "left",
          });
          doc.text(value.resultValue, cols.value.x, y, {
            width: cols.value.width,
            align: "center",
          });
          doc.text(parameter.unit || "-", cols.unit.x, y, {
            width: cols.unit.width,
            align: "center",
          });
          doc.text(rangeText, cols.range.x, y, {
            width: cols.range.width,
            align: "center",
          });
          doc
            .fillColor(statusColor)
            .text(value.resultStatus, cols.status.x, y, {
              width: cols.status.width,
              align: "center",
            });

          doc.fillColor("black");
          doc.moveDown();
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },
};
