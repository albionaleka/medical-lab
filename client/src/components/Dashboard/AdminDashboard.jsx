import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUsers, FaUserMd, FaFlask, FaChartLine } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    testCategories: 0,
    testResults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, patientsRes, categoriesRes] = await Promise.all([
          api.get("/api/auth/"),
          api.get("/api/patient/"),
          api.get("/api/categories/"),
        ]);

        setStats({
          users: usersRes.data?.length || 0,
          patients: patientsRes.data?.length || 0,
          testCategories: categoriesRes.data?.length || 0,
          testResults: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: FaUsers,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: FaUserMd,
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      title: "Test Categories",
      value: stats.testCategories,
      icon: FaFlask,
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      title: "Test Results",
      value: stats.testResults,
      icon: FaChartLine,
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
  ];

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, Admin
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/users"
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600 mt-1">
              Add, edit, or remove users
            </p>
          </a>
          <a
            href="/patients"
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Manage Patients</h4>
            <p className="text-sm text-gray-600 mt-1">
              View and manage patient records
            </p>
          </a>
          <a
            href="/categories"
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Test Categories</h4>
            <p className="text-sm text-gray-600 mt-1">
              Configure test categories
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
