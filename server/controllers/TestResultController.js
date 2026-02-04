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
      const results =
        await TestResultService.getTestResultsByPatientId(patientId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllTestResults(req, res) {
    try {
      const results = await TestResultService.getAllTestResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTestResultById(req, res) {
    try {
      const { id } = req.params;
      const result = await TestResultService.getTestResultById(id);

      if (!result) {
        return res.status(404).json({ error: "Test result not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTestResult(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TestResultService.deleteTestResult(id);

      if (!deleted) {
        return res.status(404).json({ error: "Test result not found" });
      }

      res.json({ message: "Test result deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTestResult(req, res) {
    try {
      const { id } = req.params;
      const { values } = req.body;

      if (!values) {
        return res.status(400).json({ error: "Values are required" });
      }

      const result = await TestResultService.updateTestResult(id, { values });

      if (!result) {
        return res.status(404).json({ error: "Test result not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async downloadReport(req, res) {
    try {
      const { id } = req.params;
      const pdfBuffer = await TestResultService.generatePDFReport(id);

      if (!pdfBuffer) {
        return res.status(404).json({ error: "Test result not found" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=test-result-${id}.pdf`,
      );
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
