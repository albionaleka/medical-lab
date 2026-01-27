import { TestPanelService } from "../services/TestPanelService.js";

export const TestPanelController = {
    async createTestPanel(req, res) {
        try {
            const { name, description, categoryId, parameters } = req.body;

            if (!name || !categoryId) {
                return res
                    .status(400)
                    .json({ error: "Name and Category ID are required" });
            }

            const result = await TestPanelService.createTestPanel({
                name,
                description,
                categoryId,
                parameters,
            });

            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getTestPanels(req, res) {
        try {
            const { categoryId } = req.query;
            const panels = await TestPanelService.getAllTestPanels(categoryId);
            res.json(panels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
