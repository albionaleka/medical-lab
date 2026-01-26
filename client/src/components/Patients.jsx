import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CreatePatientModal from "./CreatePatientModal";
import EditPatientModal from "./EditPatientModal";

const Patients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const fetchPatients = async () => {
        try {
            const response = await api.get("/api/patient/");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (patientId) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            try {
                await api.delete(`/api/patient/${patientId}`);
                fetchPatients();
            } catch (error) {
                console.error("Error deleting patient:", error);
            }
        }
    };

    const handlePatientCreated = () => {
        fetchPatients();
    };

    const filteredPatients = patients.filter((patient) => {
        const term = searchTerm.toLowerCase();
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const email = (patient.email || "").toLowerCase();
        const personalNumber = (patient.personalNumber || "").toLowerCase();

        return (
            fullName.includes(term) ||
            email.includes(term) ||
            personalNumber.includes(term)
        );
    });

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="fit-content relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            placeholder="Search by name, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex md:items-end items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                        <FaPlus />
                        <span>Add Patient</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Personal ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Gender
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Birth Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Contact
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 block md:table-row-group">
                                {filteredPatients.map((patient) => {
                                    const birthDate = new Date(patient.birthday).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        }
                                    );

                                    return (
                                        <tr
                                            key={patient.id}
                                            onClick={() => navigate(`/patients/${patient.id}`)}
                                            className="hover:bg-gray-50 transition-colors block md:table-row border-b md:border-b-0"
                                        >
                                            <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-900 font-medium block md:table-cell flex justify-between md:block">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    ID:
                                                </span>
                                                {patient.personalNumber}
                                            </td>
                                            <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-900 block md:table-cell flex justify-between md:block">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    Name:
                                                </span>
                                                {patient.firstName} {patient.lastName}
                                            </td>
                                            <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    Gender:
                                                </span>
                                                {patient.gender === "MALE" ? "Male" : "Female"}
                                            </td>
                                            <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    Birth Date:
                                                </span>
                                                {birthDate}
                                            </td>
                                            <td className="px-6 py-4 md:whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    Contact:
                                                </span>
                                                <div className="flex flex-col">
                                                    <span>{patient.phone}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {patient.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 md:whitespace-nowrap text-right text-sm font-medium block md:table-cell flex justify-between md:block items-center">
                                                <span className="md:hidden font-semibold text-gray-500">
                                                    Actions:
                                                </span>
                                                <div className="flex justify-end space-x-2">
                                                    {/* <button
                                                        onClick={() => navigate(`/patients/${patient.id}`)}
                                                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleEdit(patient)}
                                                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(patient.id)}
                                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center block md:table-cell"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <FaSearch className="text-gray-300 text-4xl mb-3" />
                                                <p className="text-gray-500 text-lg font-medium">
                                                    No patients found
                                                </p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Try adjusting your search criteria
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredPatients.length}</span>{" "}
                        of <span className="font-semibold">{patients.length}</span> patients
                    </div>
                </div>
            </div>

            <CreatePatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handlePatientCreated}
            />

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPatient(null);
                }}
                onSuccess={() => {
                    fetchPatients();
                    setIsEditModalOpen(false);
                    setEditingPatient(null);
                }}
                patient={editingPatient}
            />
        </>
    );
};

export default Patients;
