import { use, useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUserMd, FaFileMedical, FaChartLine } from "react-icons/fa";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    pendingResults: 0,
    completedResults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const patientsRes = await api.get("/api/patient/");
        setStats({
          patients: patientsRes.data?.length || 0,
          pendingResults: 0,
          completedResults: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, Doctor
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.patients}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FaUserMd className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Results</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingResults}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FaFileMedical className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Results</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completedResults}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FaChartLine className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/patients"
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">View Patients</h4>
            <p className="text-sm text-gray-600 mt-1">Browse patient records</p>
          </a>
          <a
            href="/test-results"
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Test Results</h4>
            <p className="text-sm text-gray-600 mt-1">
              Review and interpret results
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
