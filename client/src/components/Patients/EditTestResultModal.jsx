import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

const EditTestResultModal = ({ isOpen, onClose, onSave, testResult }) => {
  const [formValues, setFormValues] = useState([]);

  useEffect(() => {
    if (testResult && testResult.values) {
      setFormValues(
        testResult.values.map((val) => ({
          parameterId: val.parameterId,
          parameterName: val.parameter?.name || "",
          value: val.resultValue,
          status: val.resultStatus,
          unit: val.parameter?.unit || "",
          normalMin: val.parameter?.referenceRanges?.[0]?.normalMin || null,
          normalMax: val.parameter?.referenceRanges?.[0]?.normalMax || null,
        })),
      );
    }
  }, [testResult]);

  const handleValueChange = (index, newValue) => {
    const updated = [...formValues];
    updated[index].value = newValue;

    const { normalMin, normalMax } = updated[index];
    if (normalMin !== null && normalMax !== null) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        if (numValue < normalMin) {
          updated[index].status = "LOW";
        } else if (numValue > normalMax) {
          updated[index].status = "HIGH";
        } else {
          updated[index].status = "NORMAL";
        }
      }
    }

    setFormValues(updated);
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...formValues];
    updated[index].status = newStatus;
    setFormValues(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = formValues.map((val) => ({
      parameterId: val.parameterId,
      value: val.value,
      status: val.status,
    }));
    onSave(values);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Test Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {testResult?.patient?.firstName}{" "}
                    {testResult?.patient?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Test Panel</p>
                  <p className="font-medium text-gray-900">
                    {testResult?.panel?.name}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 text-lg">
                Test Parameters
              </h3>
              <div className="space-y-4">
                {formValues.map((val, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parameter
                        </label>
                        <p className="text-gray-900 font-semibold">
                          {val.parameterName}
                        </p>
                        {val.normalMin !== null && val.normalMax !== null && (
                          <p className="text-xs text-gray-500 mt-1">
                            Range: {val.normalMin} - {val.normalMax} {val.unit}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={val.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          {val.unit && (
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {val.unit}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={val.status}
                          onChange={(e) =>
                            handleStatusChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="NORMAL">NORMAL</option>
                          <option value="HIGH">HIGH</option>
                          <option value="LOW">LOW</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Status
                        </label>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            val.status === "NORMAL"
                              ? "bg-green-100 text-green-700"
                              : val.status === "HIGH"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {val.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTestResultModal;
