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

  async updateTestPanel(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedPanel = await TestPanelService.updateTestPanel(id, updates);
      res.json(updatedPanel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteTestPanel(req, res) {
    try {
      const { id } = req.params;
      await TestPanelService.deleteTestPanel(id);
      res.json({ message: "Test Panel deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
