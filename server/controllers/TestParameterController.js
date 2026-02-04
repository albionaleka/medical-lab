import { TestParameterService } from "../services/TestParameterService.js";

export const TestParameterController = {
    async createParameter(req, res) {
        try {
            const result = await TestParameterService.createParameter(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error creating parameter:", error);
            res.status(400).json({ error: error.message });
        }
    },

    async getParameterById(req, res) {
        try {
            const { id } = req.params;
            const result = await TestParameterService.getParameterById(id);
            if (!result) {
                return res.status(404).json({ error: "Parameter not found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateParameter(req, res) {
        try {
            const { id } = req.params;
            const result = await TestParameterService.updateParameter(id, req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async deleteParameter(req, res) {
        try {
            const { id } = req.params;
            await TestParameterService.deleteParameter(id);
            res.json({ message: "Parameter deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};
