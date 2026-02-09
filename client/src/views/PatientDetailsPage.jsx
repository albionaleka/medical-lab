import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import AddTestResultModal from "../components/Patients/AddTestResultModal";
import EditTestResultModal from "../components/Patients/EditTestResultModal";
import { PERMISSIONS } from "../utils/roles";

import {
  FaUser,
  FaNotesMedical,
  FaPlus,
  FaArrowLeft,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [isEditTestModalOpen, setIsEditTestModalOpen] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [expandedResults, setExpandedResults] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = PERMISSIONS[user.role] || {};

  const fetchPatientData = async () => {
    try {
      const [patientRes, testsRes] = await Promise.all([
        api.get(`/api/patient/${id}`),
        api.get(`/api/test-results/patient/${id}`),
      ]);

      setPatient(patientRes.data);
      setTestResults(testsRes.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch patient data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const toggleExpanded = (resultId) => {
    setExpandedResults((prev) => ({
      ...prev,
      [resultId]: !prev[resultId],
    }));
  };

  const handleEditTest = (result) => {
    setSelectedTestResult(result);
    setIsEditTestModalOpen(true);
  };

  const handleSaveEdit = async (values) => {
    try {
      await api.put(`/api/test-results/${selectedTestResult.id}`, { values });
      setIsEditTestModalOpen(false);
      setSelectedTestResult(null);
      fetchPatientData();
      toast.success("Test result updated successfully!");
    } catch (error) {
      console.error("Error updating test result:", error);
      toast.error("Failed to update test result");
    }
  };

  const getOverallStatus = (values) => {
    if (!values || values.length === 0) return "NORMAL";
    const hasHigh = values.some((v) => v.resultStatus === "HIGH");
    const hasLow = values.some((v) => v.resultStatus === "LOW");
    if (hasHigh) return "HIGH";
    if (hasLow) return "LOW";
    return "NORMAL";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200";
      case "LOW":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  if (loading) {
    return (
      <Layout title="Patient Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout title="Error">
        <div className="text-center text-red-600 mt-10">Patient not found</div>
      </Layout>
    );
  }

  return (
    <Layout title={`${patient.firstName} ${patient.lastName}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <button
          onClick={() => navigate("/patients")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Patients
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center text-gray-800">
              <FaUser className="mr-3 text-blue-500" /> Patient Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-800">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Personal ID</p>
              <p className="font-semibold text-gray-800">
                {patient.personalNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold text-gray-800">
                {new Date(patient.birthday).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold text-gray-800">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{patient.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-bold flex items-center text-gray-800">
              <FaNotesMedical className="mr-3 text-green-500" /> Test Results
            </h2>
            {userPermissions.canCreateTestResults && (
              <button
                onClick={() => setIsAddTestModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-medium shadow-sm"
              >
                <FaPlus className="mr-2" /> Add Test Result
              </button>
            )}
          </div>

          <div className="p-6">
            {testResults.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <FaNotesMedical className="mx-auto text-5xl mb-4 text-gray-300" />
                <p className="text-lg font-medium">No test results found</p>
                <p className="text-sm mt-2">
                  Add a new test result to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result) => {
                  const overallStatus = getOverallStatus(result.values);
                  const isExpanded = expandedResults[result.id];

                  return (
                    <div
                      key={result.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 cursor-pointer"
                        onClick={() => toggleExpanded(result.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {result.panel?.name || "Unknown Panel"}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(overallStatus)}`}
                              >
                                {overallStatus}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span>
                                  {new Date(
                                    result.created_at || result.testedAt,
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span>
                                {new Date(
                                  result.created_at || result.testedAt,
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="font-medium">
                                {result.values?.length || 0} parameters
                              </span>
                            </div>
                          </div>
                          <button className="ml-4 p-2 hover:bg-white rounded-full transition-colors">
                            {isExpanded ? (
                              <FaChevronUp className="text-gray-600" />
                            ) : (
                              <FaChevronDown className="text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-white">
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Parameter
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Result
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Unit
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Reference Range
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {result.values &&
                                  result.values.map((val, idx) => (
                                    <tr
                                      key={val.id}
                                      className={`hover:bg-gray-50 transition-colors ${
                                        idx % 2 === 0
                                          ? "bg-white"
                                          : "bg-gray-50/50"
                                      }`}
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                          {val.parameter?.name ||
                                            `Parameter ${val.parameterId}`}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-gray-900">
                                          {val.resultValue}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                          {val.parameter?.unit || "—"}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 font-mono">
                                          {val.parameter?.referenceRanges?.[0]
                                            ? `${val.parameter.referenceRanges[0].normalMin} - ${val.parameter.referenceRanges[0].normalMax}`
                                            : "—"}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span
                                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                            val.resultStatus === "NORMAL"
                                              ? "bg-green-50 text-green-700 border-green-200"
                                              : val.resultStatus === "HIGH"
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                          }`}
                                        >
                                          {val.resultStatus}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>

                            {userPermissions.canCreateTestResults && (
                              <div className="flex justify-end p-4">
                                <button
                                  className="text-right px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
                                  onClick={() => handleEditTest(result)}
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTestResultModal
        isOpen={isAddTestModalOpen}
        onClose={() => setIsAddTestModalOpen(false)}
        patientId={id}
        onSuccess={fetchPatientData}
      />

      <EditTestResultModal
        isOpen={isEditTestModalOpen}
        onClose={() => {
          setIsEditTestModalOpen(false);
          setSelectedTestResult(null);
        }}
        onSave={handleSaveEdit}
        testResult={selectedTestResult}
      />
    </Layout>
  );
};

export default PatientDetailsPage;
