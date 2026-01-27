import { TestPanel, TestParameter, ReferenceRanges } from "../models/index.js";
import sequelize from "../config/database.js";

export const TestPanelService = {
    async createTestPanel(data) {
        const t = await sequelize.transaction();

        try {
            const { name, description, categoryId, parameters } = data;

            const panel = await TestPanel.create(
                {
                    name,
                    description,
                    categoryId,
                },
                { transaction: t }
            );

            if (parameters && parameters.length > 0) {
                for (const param of parameters) {
                    const newParam = await TestParameter.create(
                        {
                            name: param.name,
                            unit: param.unit,
                            panelId: panel.id,
                        },
                        { transaction: t }
                    );

                    if (param.referenceRanges && param.referenceRanges.length > 0) {
                        for (const range of param.referenceRanges) {
                            await ReferenceRanges.create(
                                {
                                    parameterId: newParam.id,
                                    gender: range.gender,
                                    normalMin: range.normalMin,
                                    normalMax: range.normalMax,
                                },
                                { transaction: t }
                            );
                        }
                    }
                }
            }

            await t.commit();
            return getTestPanelById(panel.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    async getTestPanelById(id) {
        return await TestPanel.findByPk(id, {
            include: [
                {
                    model: TestParameter,
                    as: "parameters",
                    include: [
                        {
                            model: ReferenceRanges,
                            as: "referenceRanges",
                        },
                    ],
                },
            ],
        });
    },

    async getAllTestPanels(categoryId = null) {
        const whereClause = categoryId ? { categoryId } : {};
        return await TestPanel.findAll({
            where: whereClause,
            include: [
                {
                    model: TestParameter,
                    as: "parameters",
                    include: [
                        {
                            model: ReferenceRanges,
                            as: "referenceRanges",
                        },
                    ],
                },
            ],
        });
    },
};
