import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  FaTimes,
  FaFlask,
  FaSave,
  FaChevronDown,
  FaInfoCircle,
} from "react-icons/fa";

const AddTestResultModal = ({ isOpen, onClose, patientId, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [panels, setPanels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("");
  const [testValues, setTestValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setSelectedCategory("");
      setSelectedPanel("");
      setTestValues({});
      setPanels([]);
      setError("");
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  };

  const fetchPanels = async (categoryId) => {
    try {
      const response = await api.get(`/api/tests?categoryId=${categoryId}`);
      setPanels(response.data);
    } catch (err) {
      console.error("Error fetching panels:", err);
      setError("Failed to load test panels.");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedPanel("");
    setTestValues({});
    if (categoryId) {
      fetchPanels(categoryId);
    } else {
      setPanels([]);
    }
  };

  const handlePanelChange = (e) => {
    const panelId = e.target.value;
    setSelectedPanel(panelId);
    setTestValues({});
  };

  const calculateStatus = (value, parameter) => {
    if (!parameter.referenceRanges || parameter.referenceRanges.length === 0) {
      return "NORMAL";
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "NORMAL";

    const range = parameter.referenceRanges[0];
    const normalMin = parseFloat(range.normalMin);
    const normalMax = parseFloat(range.normalMax);

    if (numValue < normalMin) {
      return "LOW";
    } else if (numValue > normalMax) {
      return "HIGH";
    } else {
      return "NORMAL";
    }
  };

  const handleValueChange = (parameterId, value, parameter) => {
    const status = calculateStatus(value, parameter);
    setTestValues((prev) => ({
      ...prev,
      [parameterId]: { value, status },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const panel = panels.find((p) => p.id === parseInt(selectedPanel));
      if (!panel) throw new Error("Invalid panel selected");

      const values = panel.parameters.map((param) => {
        const input = testValues[param.id] || { value: "", status: "NORMAL" };
        return {
          parameterId: param.id,
          value: input.value,
          status: input.status,
        };
      });

      await api.post("/api/test-results", {
        patientId,
        panelId: selectedPanel,
        values,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving test results:", err);
      setError("Failed to save test results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPanel = panels.find((p) => p.id === parseInt(selectedPanel));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FaFlask className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add Test Result</h2>
              <p className="text-blue-100 text-sm">
                Enter test parameters and results
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3">
              <FaInfoCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Test Panel
                </label>
                <div className="relative">
                  <select
                    value={selectedPanel}
                    onChange={handlePanelChange}
                    className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
                    required
                  >
                    <option value="">Select a Test Panel</option>
                    {panels.map((panel) => (
                      <option key={panel.id} value={panel.id}>
                        {panel.name}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {currentPanel && (
            <div className="space-y-4 border-t-2 border-gray-100 pt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <FaFlask className="w-4 h-4" />
                  Enter Results for {currentPanel.name}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {currentPanel.parameters.length} parameters to fill
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {currentPanel.parameters.map((param) => {
                  const currentStatus =
                    testValues[param.id]?.status || "NORMAL";
                  const hasValue = testValues[param.id]?.value;
                  const statusColor =
                    currentStatus === "HIGH"
                      ? "border-red-300"
                      : currentStatus === "LOW"
                        ? "border-yellow-300"
                        : "border-green-300";
                  const statusBgColor =
                    currentStatus === "HIGH"
                      ? "bg-red-50"
                      : currentStatus === "LOW"
                        ? "bg-yellow-50"
                        : "bg-green-50";
                  const statusTextColor =
                    currentStatus === "HIGH"
                      ? "text-red-700"
                      : currentStatus === "LOW"
                        ? "text-yellow-700"
                        : "text-green-700";

                  return (
                    <div
                      key={param.id}
                      className={`bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border-2 hover:border-blue-300 transition-all ${hasValue ? statusColor : "border-gray-200"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <label className="block text-base font-semibold text-gray-800 mb-1">
                            {param.name}
                          </label>
                          {param.referenceRanges &&
                            param.referenceRanges.length > 0 && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <FaInfoCircle className="w-3 h-3" />
                                Normal range:{" "}
                                {param.referenceRanges[0].normalMin} -{" "}
                                {param.referenceRanges[0].normalMax}{" "}
                                {param.unit}
                              </div>
                            )}
                        </div>
                        {hasValue && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusTextColor} ${statusBgColor} border-2 ${statusColor}`}
                          >
                            {currentStatus === "HIGH"
                              ? "⬆ HIGH"
                              : currentStatus === "LOW"
                                ? "⬇ LOW"
                                : "✓ NORMAL"}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Enter Value
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            placeholder="Enter value"
                            className="w-full p-3 pr-20 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={testValues[param.id]?.value || ""}
                            onChange={(e) =>
                              handleValueChange(param.id, e.target.value, param)
                            }
                            required
                          />
                          {param.unit && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {param.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPanel}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-lg"
            >
              <FaSave className="w-4 h-4" />
              {loading ? "Saving..." : "Save Results"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestResultModal;
