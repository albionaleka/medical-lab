import { TestResultService } from "../services/TestResultService.js";

export const TestResultController = {
    async createTestResult(req, res) {
        try {
            const { patientId, panelId, values } = req.body;

            if (!patientId || !panelId || !values) {
                return res
                    .status(400)
                    .json({ error: "Patient ID, Panel ID, and Values are required" });
            }

            const result = await TestResultService.createTestResult({
                patientId,
                panelId,
                values,
            });

            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getTestResultsByPatient(req, res) {
        try {
            const { patientId } = req.params;
            const results = await TestResultService.getTestResultsByPatientId(patientId);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
