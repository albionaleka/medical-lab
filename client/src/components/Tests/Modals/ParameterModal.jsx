import { useState, useEffect } from "react";
import TestsService from "../../../services/TestsService";
import { FaTimes, FaPlus, FaTrash, FaDna } from "react-icons/fa";

const ParameterModal = ({
  isOpen,
  onClose,
  mode,
  parameter,
  panelId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    referenceRanges: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && parameter) {
      setFormData({
        name: parameter.name || "",
        unit: parameter.unit || "",
        referenceRanges: parameter.referenceRanges
          ? [...parameter.referenceRanges]
          : [],
      });
    } else {
      setFormData({ name: "", unit: "", referenceRanges: [] });
    }
    setError("");
  }, [mode, parameter, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = (index, field, value) => {
    const newRanges = [...formData.referenceRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setFormData((prev) => ({ ...prev, referenceRanges: newRanges }));
  };

  const addRange = () => {
    setFormData((prev) => ({
      ...prev,
      referenceRanges: [
        ...prev.referenceRanges,
        { gender: "MALE", normalMin: "", normalMax: "" },
      ],
    }));
  };

  const removeRange = (index) => {
    const newRanges = formData.referenceRanges.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, referenceRanges: newRanges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        panelId: panelId,
      };

      if (mode === "create") {
        await TestsService.createParameter(payload);
      } else {
        await TestsService.updateParameter(parameter.id, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FaDna className="text-teal-600 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {mode === "create" ? "New Parameter" : "Edit Parameter"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm flex items-center gap-2 animate-slideDown">
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parameter Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="e.g., Glucose"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="e.g., mg/dL"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Reference Ranges
                  </label>
                  <button
                    type="button"
                    onClick={addRange}
                    className="text-sm text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all border border-teal-200"
                  >
                    <FaPlus size={12} /> Add Range
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.referenceRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <select
                          value={range.gender}
                          onChange={(e) =>
                            handleRangeChange(index, "gender", e.target.value)
                          }
                          className="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 py-2"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="CHILD">Child</option>
                          <option value="GENERAL">General</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          value={range.normalMin}
                          onChange={(e) =>
                            handleRangeChange(
                              index,
                              "normalMin",
                              e.target.value,
                            )
                          }
                          placeholder="Min"
                          className="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 py-2 px-3"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="w-24">
                        <input
                          type="text"
                          value={range.normalMax}
                          onChange={(e) =>
                            handleRangeChange(
                              index,
                              "normalMax",
                              e.target.value,
                            )
                          }
                          placeholder="Max"
                          className="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 py-2 px-3"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRange(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        title="Remove range"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                  {formData.referenceRanges.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-200">
                      No reference ranges defined. Click "Add Range" to create
                      one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-teal-500/30 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Parameter"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParameterModal;
