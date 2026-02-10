import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FaUserMd,
  FaFlask,
  FaChartLine,
  FaExclamationCircle,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";
import StatCard from "./StatCard";
import PieChart from "./PieChart";
import LineChart from "./LineChart";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <FaExclamationCircle className="text-red-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load dashboard
      </h3>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
        {message ||
          "An error occurred while fetching dashboard data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    testResults: 0,
  });
  const [recentResults, setRecentResults] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [testStatusData, setTestStatusData] = useState([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMonthlyData = (results) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyStats = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = months[date.getMonth()];
      monthlyStats[monthKey] = { label: monthLabel, count: 0 };
    }

    results.forEach((result) => {
      const date = new Date(result.testedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].count++;
      }
    });

    const growthData = Object.values(monthlyStats).map((m) => ({
      label: m.label,
      value: m.count,
    }));

    return { growthData };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [patientsRes, testResultsRes] = await Promise.all([
        api.get("/api/patient/"),
        api.get("/api/test-results/"),
      ]);

      const allPatients = patientsRes.data || [];
      const results = testResultsRes.data || [];

      const { growthData } = getMonthlyData(results);

      setStats({
        patients: allPatients.length,
        testResults: results.length,
      });

      setMonthlyGrowthData(growthData);

      setRecentResults(results.slice(0, 5));

      const statusCounts = { NORMAL: 0, HIGH: 0, LOW: 0 };
      results.forEach((result) => {
        result.values?.forEach((val) => {
          statusCounts[val.resultStatus] =
            (statusCounts[val.resultStatus] || 0) + 1;
        });
      });

      const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
      setTestStatusData([
        {
          name: "Normal",
          value: statusCounts.NORMAL,
          percentage: total
            ? ((statusCounts.NORMAL / total) * 100).toFixed(1)
            : 0,
          color: "#10b981",
        },
        {
          name: "High",
          value: statusCounts.HIGH,
          percentage: total
            ? ((statusCounts.HIGH / total) * 100).toFixed(1)
            : 0,
          color: "#ef4444",
        },
        {
          name: "Low",
          value: statusCounts.LOW,
          percentage: total ? ((statusCounts.LOW / total) * 100).toFixed(1) : 0,
          color: "#f59e0b",
        },
      ]);

      const patients = patientsRes.data || [];
      setRecentPatients(patients.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(
        err.response?.data?.message || "Failed to load dashboard statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchStats} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={FaUserMd}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />

        <StatCard
          title="Total Tests"
          value={stats.testResults}
          icon={FaChartLine}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tests Growth</h2>
              <p className="text-sm text-gray-600 mt-1">Last 6 months trend</p>
            </div>
            <FaCalendarAlt className="text-blue-500" size={20} />
          </div>
          <LineChart data={monthlyGrowthData} height={280} />
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Results Status
              </h2>
              <p className="text-sm text-gray-600 mt-1">Test distribution</p>
            </div>
            <FaChartLine className="text-purple-500" size={20} />
          </div>

          {testStatusData.length > 0 &&
          testStatusData.some((d) => d.value > 0) ? (
            <div>
              <PieChart data={testStatusData} />
              <div className="mt-6 space-y-3">
                {testStatusData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {item.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaChartLine className="mx-auto text-4xl mb-2 text-gray-300" />
              <p className="text-sm">No test data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Test Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">Latest submissions</p>
            </div>
            <button
              onClick={() => navigate("/test-results")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>

          {recentResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <FaFlask className="text-gray-400" size={24} />
              </div>
              <p className="font-medium">No test results yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentResults.map((result) => (
                <div
                  key={result.id}
                  className="group relative bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                  onClick={() => navigate(`/patients/${result.patientId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaFlask className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {result.patient?.firstName} {result.patient?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {result.panel?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {result.created_at || result.testedAt
                          ? `${new Date(
                              result.created_at || result.testedAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })} • ${new Date(
                              result.created_at || result.testedAt,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "N/A"}
                      </p>
                    </div>
                    <FaEye className="text-gray-400" size={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Patients
              </h2>
              <p className="text-sm text-gray-600 mt-1">Recently added</p>
            </div>
            <button
              onClick={() => navigate("/patients")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>

          {recentPatients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <FaUserMd className="text-gray-400" size={24} />
              </div>
              <p className="font-medium">No patients yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="group relative bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {patient.firstName} {patient.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        ID: {patient.personalNumber}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
