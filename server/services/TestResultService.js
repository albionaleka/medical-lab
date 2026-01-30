import { TestResult, TestResultValues } from "../models/index.js";
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
                { transaction: t }
            );

            if (values && values.length > 0) {
                for (const val of values) {
                    await TestResultValues.create(
                        {
                            testResultId: testResult.id,
                            parameterId: val.parameterId,
                            resultValue: val.value,
                            resultStatus: val.status || "NORMAL", // Should be calculated or provided
                        },
                        { transaction: t }
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
            include: ["panel", "values"]
        });
    }
};
