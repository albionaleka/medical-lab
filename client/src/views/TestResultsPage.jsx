import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import ConfirmationModal from "../components/ConfirmationModal";
import EditTestResultModal from "../components/Patients/EditTestResultModal";
import { PERMISSIONS } from "../utils/roles";

import {
  FaFlask,
  FaSearch,
  FaEye,
  FaTrash,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaEdit,
} from "react-icons/fa";

const TestResultsPage = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [resultToEdit, setResultToEdit] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = PERMISSIONS[user.role] || {};

  useEffect(() => {
    fetchTestResults();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, testResults]);

  const fetchTestResults = async () => {
    try {
      const response = await api.get("/api/test-results");
      setTestResults(response.data);
    } catch (error) {
      console.error("Error fetching test results:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...testResults];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((result) => {
        const patientName =
          `${result.patient?.firstName} ${result.patient?.lastName}`.toLowerCase();
        const panelName = result.panel?.name?.toLowerCase() || "";
        const personalNumber =
          result.patient?.personalNumber?.toLowerCase() || "";
        return (
          patientName.includes(searchTerm.toLowerCase()) ||
          panelName.includes(searchTerm.toLowerCase()) ||
          personalNumber.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((result) => {
        const hasStatus = result.values?.some(
          (val) => val.resultStatus === statusFilter,
        );
        return hasStatus;
      });
    }

    if (dateFilter !== "ALL") {
      const now = new Date();
      filtered = filtered.filter((result) => {
        const testDate = new Date(result.created_at);
        const diffTime = Math.abs(now - testDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "TODAY":
            return diffDays <= 1;
          case "WEEK":
            return diffDays <= 7;
          case "MONTH":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredResults(filtered);
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const handleDelete = (id) => {
    setResultToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/test-results/${resultToDelete}`);
      fetchTestResults();
    } catch (error) {
      console.error("Error deleting test result:", error);
      alert("Failed to delete test result");
    }
  };

  const handleDownloadReport = async (resultId) => {
    try {
      const response = await api.get(`/api/test-results/${resultId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `test-result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    }
  };

  const handleEdit = (result) => {
    setResultToEdit(result);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (values) => {
    try {
      await api.put(`/api/test-results/${resultToEdit.id}`, { values });
      setShowEditModal(false);
      setResultToEdit(null);
      fetchTestResults();
    } catch (error) {
      console.error("Error updating test result:", error);
      alert("Failed to update test result");
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      NORMAL: "bg-green-100 text-green-800",
      HIGH: "bg-red-100 text-red-800",
      LOW: "bg-yellow-100 text-yellow-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getOverallStatus = (values) => {
    if (!values || values.length === 0) return "NORMAL";
    const hasHigh = values.some((v) => v.resultStatus === "HIGH");
    const hasLow = values.some((v) => v.resultStatus === "LOW");
    if (hasHigh) return "HIGH";
    if (hasLow) return "LOW";
    return "NORMAL";
  };

  if (loading) {
    return (
      <Layout title="Test Results">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Test Results">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaFlask className="mr-3 text-blue-600" />
                Test Results
              </h1>
              <p className="text-gray-500 mt-1">
                {filteredResults.length} results found
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient, panel, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="block xl:hidden space-y-4">
          {filteredResults.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              <FaFlask className="mx-auto text-5xl mb-4 text-gray-300" />
              <p className="text-lg">No test results found</p>
            </div>
          ) : (
            filteredResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleViewDetails(result)}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {result.patient?.firstName} {result.patient?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {result.patient?.personalNumber}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(getOverallStatus(result.values))}`}
                  >
                    {getOverallStatus(result.values)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm">
                    <FaFlask className="text-gray-400 mr-2 flex-shrink-0" />
                    <span className="font-medium text-gray-700">
                      {result.panel?.name || "Unknown Panel"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                    <span>
                      {result.testedAt
                        ? new Date(result.testedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                      {" • "}
                      {result.created_at
                        ? new Date(result.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.values?.length || 0} parameters tested
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPatient(result.patient?.id);
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Patient"
                  >
                    <FaUser className="h-4 w-4" />
                  </button>
                  {userPermissions.canCreateTestResults && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(result);
                      }}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Results"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReport(result.id);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download Report"
                  >
                    <FaDownload className="h-4 w-4" />
                  </button>
                  {userPermissions.canDeleteTestResults && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(result.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden xl:block bg-white rounded-xl shadow-md overflow-hidden">
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FaFlask className="mx-auto text-5xl mb-4 text-gray-300" />
              <p className="text-lg">No test results found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Panel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parameters
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <tr
                      key={result.id}
                      onClick={() => handleViewDetails(result)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {result.patient?.firstName}{" "}
                              {result.patient?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {result.patient?.personalNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.panel?.name || "Unknown Panel"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.testedAt
                            ? new Date(result.testedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.created_at
                            ? new Date(result.created_at).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.values?.length || 0} parameters
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(getOverallStatus(result.values))}`}
                        >
                          {getOverallStatus(result.values)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPatient(result.patient?.id);
                          }}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="View Patient"
                        >
                          <FaUser className="inline h-5 w-5" />
                        </button>
                        {userPermissions.canCreateTestResults && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(result);
                            }}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                            title="Edit Results"
                          >
                            <FaEdit className="inline h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReport(result.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Download Report"
                        >
                          <FaDownload className="inline h-5 w-5" />
                        </button>
                        {userPermissions.canDeleteTestResults && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(result.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash className="inline h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Test Result Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedResult.patient?.firstName}{" "}
                      {selectedResult.patient?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Personal ID</p>
                    <p className="font-medium text-gray-900">
                      {selectedResult.patient?.personalNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Test Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Panel</p>
                    <p className="font-medium text-gray-900">
                      {selectedResult.panel?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Test Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedResult.testedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-4 text-lg">
                  Test Parameters & Results
                </h3>
                <div className="space-y-3">
                  {selectedResult.values?.map((val, idx) => {
                    const refRange = val.parameter?.referenceRanges?.[0];
                    const hasRange =
                      refRange && refRange.normalMin && refRange.normalMax;

                    return (
                      <div
                        key={val.id}
                        className={`p-4 rounded-xl ${
                          val.resultStatus === "NORMAL"
                            ? "bg-green-50/30"
                            : val.resultStatus === "HIGH"
                              ? "bg-red-50/30"
                              : "bg-yellow-50/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Parameter Name */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {val.parameter?.name ||
                                `Parameter ${val.parameterId}`}
                            </h4>
                            {hasRange && (
                              <p className="text-xs text-gray-500 mt-1">
                                Normal range: {refRange.normalMin} -{" "}
                                {refRange.normalMax} {val.parameter?.unit}
                              </p>
                            )}
                          </div>

                          {/* Result Value */}
                          <div className="text-right">
                            <div className="flex items-baseline gap-2 justify-end">
                              <span className="text-2xl font-bold text-gray-900">
                                {val.resultValue}
                              </span>
                              {val.parameter?.unit && (
                                <span className="text-sm text-gray-600 font-medium">
                                  {val.parameter.unit}
                                </span>
                              )}
                            </div>
                            <span
                              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                val.resultStatus === "NORMAL"
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : val.resultStatus === "HIGH"
                                    ? "bg-red-100 text-red-700 border border-red-300"
                                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                              }`}
                            >
                              {val.resultStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              {userPermissions.canCreateTestResults && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedResult);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                >
                  <FaEdit className="h-4 w-4" />
                  Edit Results
                </button>
              )}
              <button
                onClick={() => handleDownloadReport(selectedResult.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaDownload className="h-4 w-4" />
                Download Report
              </button>
              <button
                onClick={() => handleViewPatient(selectedResult.patient?.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Patient
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Test Result"
        message="Are you sure you want to delete this test result? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      {/* Edit Test Result Modal */}
      <EditTestResultModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setResultToEdit(null);
        }}
        onSave={handleSaveEdit}
        testResult={resultToEdit}
      />
    </Layout>
  );
};

export default TestResultsPage;
