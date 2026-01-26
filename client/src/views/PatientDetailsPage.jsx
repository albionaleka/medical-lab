import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import AddTestResultModal from "../components/Patients/AddTestResultModal";
import { FaUser, FaNotesMedical, FaPlus, FaArrowLeft } from "react-icons/fa";

const PatientDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);

    const fetchPatientData = async () => {
        try {
            const [patientRes, testsRes] = await Promise.all([
                api.get(`/api/patient/${id}`),
                api.get(`/api/test-results/${id}`),
            ]);
            setPatient(patientRes.data);
            setTestResults(testsRes.data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientData();
    }, [id]);

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
                            <p className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Personal ID</p>
                            <p className="font-semibold text-gray-800">{patient.personalNumber}</p>
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
                        <button
                            onClick={() => setIsAddTestModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-medium shadow-sm"
                        >
                            <FaPlus className="mr-2" /> Add Test Result
                        </button>
                    </div>

                    <div className="p-6">
                        {testResults.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No test results found for this patient.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {testResults.map((result) => (
                                    <div key={result.id} className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{result.panel?.name || "Unknown Panel"}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(result.testedAt).toLocaleDateString()} at {new Date(result.testedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                Completed
                                            </span>
                                        </div>
                                        <div className="p-4 overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-500 border-b">
                                                        <th className="pb-2 font-medium">Parameter</th>
                                                        <th className="pb-2 font-medium">Result</th>
                                                        <th className="pb-2 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.values && result.values.map((val) => (
                                                        <tr key={val.id} className="border-b last:border-0 hover:bg-gray-50">
                                                            <td className="py-2 pr-4 text-gray-600">
                                                                Parameter {val.parameterId} {/* Ideally join with Parameter name if available in basic include */}
                                                            </td>
                                                            <td className="py-2 pr-4 font-semibold">
                                                                {val.resultValue}
                                                            </td>
                                                            <td className="py-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${val.resultStatus === 'NORMAL' ? 'bg-green-100 text-green-800' :
                                                                    val.resultStatus === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {val.resultStatus}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
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
        </Layout>
    );
};

export default PatientDetailsPage;
