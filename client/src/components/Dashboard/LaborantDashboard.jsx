import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUserMd, FaFlask, FaFileMedical } from "react-icons/fa";

const LaborantDashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    testCategories: 0,
    pendingTests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [patientsRes, categoriesRes] = await Promise.all([
          api.get("/api/patient/"),
          api.get("/api/categories/"),
        ]);

        setStats({
          patients: patientsRes.data?.length || 0,
          testCategories: categoriesRes.data?.length || 0,
          pendingTests: 0,
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
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
              <p className="text-sm text-gray-600 mb-1">Test Categories</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.testCategories}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <FaFlask className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Tests</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingTests}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <FaFileMedical className="text-white" size={24} />
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
            <h4 className="font-medium text-gray-900">Add Patient</h4>
            <p className="text-sm text-gray-600 mt-1">Register a new patient</p>
          </a>
          <a
            href="/test-results"
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Enter Test Results</h4>
            <p className="text-sm text-gray-600 mt-1">Record lab test values</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LaborantDashboard;
