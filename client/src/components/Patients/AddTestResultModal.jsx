import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaTimes } from "react-icons/fa";

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

    const handleValueChange = (parameterId, value, status) => {
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Add Test Result</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select a Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Test Panel
                            </label>
                            <select
                                value={selectedPanel}
                                onChange={handlePanelChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a Test Panel</option>
                                {panels.map((panel) => (
                                    <option key={panel.id} value={panel.id}>
                                        {panel.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {currentPanel && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-gray-800">
                                Enter Results for {currentPanel.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentPanel.parameters.map((param) => (
                                    <div key={param.id} className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {param.name} <span className="text-xs text-gray-500">({param.unit})</span>
                                        </label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Value"
                                                className="w-2/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        param.id,
                                                        e.target.value,
                                                        testValues[param.id]?.status || "NORMAL"
                                                    )
                                                }
                                                required
                                            />
                                            <select
                                                className="w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                value={testValues[param.id]?.status || "NORMAL"}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        param.id,
                                                        testValues[param.id]?.value || "",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="NORMAL">Normal</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                        </div>
                                        {param.referenceRanges && param.referenceRanges.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-500">
                                                Range: {param.referenceRanges[0].normalMin} - {param.referenceRanges[0].normalMax}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedPanel}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Results"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTestResultModal;
