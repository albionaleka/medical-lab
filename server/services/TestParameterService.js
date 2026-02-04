import { TestParameter, ReferenceRanges } from "../models/index.js";
import sequelize from "../config/database.js";

export const TestParameterService = {
    async createParameter(data) {
        const t = await sequelize.transaction();
        try {
            const { name, unit, panelId, referenceRanges } = data;

            const parameter = await TestParameter.create(
                { name, unit, panelId },
                { transaction: t }
            );

            if (referenceRanges && referenceRanges.length > 0) {
                for (const range of referenceRanges) {
                    await ReferenceRanges.create(
                        { ...range, parameterId: parameter.id },
                        { transaction: t }
                    );
                }
            }

            await t.commit();
            return parameter.get({ plain: true });
        } catch (error) {
            if (!t.finished) {
                await t.rollback();
            }
            throw error;
        }
    },

    async getParameterById(id) {
        return await TestParameter.findByPk(id, {
            include: [{ model: ReferenceRanges, as: "referenceRanges" }],
        });
    },

    async updateParameter(id, data) {
        const t = await sequelize.transaction();
        try {
            const { name, unit, referenceRanges } = data;
            const parameter = await TestParameter.findByPk(id);

            if (!parameter) {
                throw new Error("Parameter not found");
            }

            await parameter.update({ name, unit }, { transaction: t });

            if (referenceRanges) {
                await ReferenceRanges.destroy({
                    where: { parameterId: id },
                    transaction: t,
                });

                for (const range of referenceRanges) {
                    await ReferenceRanges.create(
                        { ...range, parameterId: id },
                        { transaction: t }
                    );
                }
            }

            await t.commit();

            // Return simple parameter object to avoid association fetch errors
            return parameter.get({ plain: true });
        } catch (error) {
            if (!t.finished) {
                await t.rollback();
            }
            throw error;
        }
    },

    async deleteParameter(id) {
        const parameter = await TestParameter.findByPk(id);
        if (!parameter) {
            throw new Error("Parameter not found");
        }

        const t = await sequelize.transaction();
        try {
            await ReferenceRanges.destroy({
                where: { parameterId: id },
                transaction: t
            });
            await parameter.destroy({ transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },
};
