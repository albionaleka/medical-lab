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
        { transaction: t },
      );

      if (parameters && parameters.length > 0) {
        for (const param of parameters) {
          const newParam = await TestParameter.create(
            {
              name: param.name,
              unit: param.unit,
              panelId: panel.id,
            },
            { transaction: t },
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
                { transaction: t },
              );
            }
          }
        }
      }

      await t.commit();
      return this.getTestPanelById(panel.id);
    } catch (error) {
      if (!t.finished) {
        await t.rollback();
      }
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
  async updateTestPanel(id, data) {
    const { name, description, categoryId } = data;
    const panel = await TestPanel.findByPk(id);

    if (!panel) {
      throw new Error("Test Panel not found");
    }

    return await panel.update({
      name,
      description,
      categoryId,
    });
  },

  async deleteTestPanel(id) {
    const panel = await TestPanel.findByPk(id);

    if (!panel) {
      throw new Error("Test Panel not found");
    }

    const t = await sequelize.transaction();
    try {
      const parameters = await TestParameter.findAll({
        where: { panelId: id },
        transaction: t,
      });

      for (const param of parameters) {
        await ReferenceRanges.destroy({
          where: { parameterId: param.id },
          transaction: t,
        });
        await param.destroy({ transaction: t });
      }

      await panel.destroy({ transaction: t });
      await t.commit();
      return { message: "Test Panel deleted successfully" };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};
