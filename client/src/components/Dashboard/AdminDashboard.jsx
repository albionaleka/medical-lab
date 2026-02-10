import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FaUsers,
  FaUserMd,
  FaFlask,
  FaChartLine,
  FaExclamationCircle,
  FaEye,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import StatCard from "./StatCard";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    testResults: 0,
    revenue: 0,
  });
  const [growthStats, setGrowthStats] = useState({
    usersGrowth: { percent: 0, trend: "up", text: "" },
    patientsGrowth: { percent: 0, trend: "up", text: "" },
    testsGrowth: { percent: 0, trend: "up", text: "" },
    revenueGrowth: { percent: 0, trend: "up", text: "" },
  });
  const [recentResults, setRecentResults] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [testStatusData, setTestStatusData] = useState([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateGrowth = (current, previous, period = "period") => {
    if (previous === 0) {
      return { percent: 0, trend: "up", text: "No previous data" };
    }
    const percentChange = ((current - previous) / previous) * 100;
    const trend = percentChange >= 0 ? "up" : "down";
    const absPercent = Math.abs(percentChange).toFixed(1);
    const text = `${absPercent}% from ${period}`;
    return { percent: percentChange, trend, text };
  };

  const getDataByTimeRange = (data, daysAgo) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt || item.testedAt);
      return itemDate >= cutoffDate;
    });
  };

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
      monthlyStats[monthKey] = { label: monthLabel, count: 0, revenue: 0 };
    }

    results.forEach((result) => {
      const date = new Date(result.created_at || result.testedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].count++;
        const price = result.panel?.category?.price || 0;
        monthlyStats[monthKey].revenue += parseFloat(price);
      }
    });

    const growthData = Object.values(monthlyStats).map((m) => ({
      label: m.label,
      value: m.count,
    }));

    const revenueData = Object.values(monthlyStats).map((m) => ({
      label: m.label,
      value: m.revenue,
      color: "#10b981",
    }));

    return {
      growthData,
      revenueData,
      totalRevenue: revenueData.reduce((sum, d) => sum + d.value, 0),
    };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, patientsRes, testResultsRes] = await Promise.all([
        api.get("/api/auth/"),
        api.get("/api/patient/"),
        api.get("/api/test-results/"),
      ]);

      const allUsers = usersRes.data || [];
      const allPatients = patientsRes.data || [];
      const results = testResultsRes.data || [];

      const { growthData, revenueData, totalRevenue } = getMonthlyData(results);

      const usersLastWeek = getDataByTimeRange(allUsers, 7).length;
      const usersPrev2Weeks =
        getDataByTimeRange(allUsers, 14).length - usersLastWeek;
      const usersGrowth = calculateGrowth(
        usersLastWeek,
        usersPrev2Weeks,
        "last week",
      );

      const patientsYesterday = getDataByTimeRange(allPatients, 1).length;
      const patients2DaysAgo =
        getDataByTimeRange(allPatients, 2).length - patientsYesterday;
      const patientsGrowth = calculateGrowth(
        patientsYesterday,
        patients2DaysAgo,
        "yesterday",
      );

      const testsYesterday = getDataByTimeRange(results, 1).length;
      const tests2DaysAgo =
        getDataByTimeRange(results, 2).length - testsYesterday;
      const testsGrowth = calculateGrowth(
        testsYesterday,
        tests2DaysAgo,
        "yesterday",
      );

      const revenueThisMonth =
        revenueData.find((_, idx) => idx === revenueData.length - 1)?.value ||
        0;
      const revenueLastMonth =
        revenueData.find((_, idx) => idx === revenueData.length - 2)?.value ||
        0;
      const revenueGrowth = calculateGrowth(
        revenueThisMonth,
        revenueLastMonth,
        "last month",
      );

      setStats({
        users: allUsers.length,
        patients: allPatients.length,
        testResults: results.length,
        revenue: totalRevenue,
      });

      setGrowthStats({
        usersGrowth,
        patientsGrowth,
        testsGrowth,
        revenueGrowth,
      });

      setMonthlyGrowthData(growthData);
      setMonthlyRevenueData(revenueData);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={FaUsers}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />

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

        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Tests Growth (Last 6 Months)
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Monthly test completion trend
              </p>
            </div>
            <FaCalendarAlt className="text-blue-500" size={20} />
          </div>
          <LineChart data={monthlyGrowthData} height={250} />
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue (Last 6 Months)
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total revenue from tests
              </p>
            </div>
            <FaDollarSign className="text-green-500" size={20} />
          </div>
          <BarChart data={monthlyRevenueData} height={250} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Test Results
            </h2>
            <button
              onClick={() => navigate("/test-results")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>

          {recentResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaChartLine className="mx-auto text-4xl mb-2 text-gray-300" />
              <p>No test results yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/patients/${result.patientId}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaFlask className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {result.patient?.firstName} {result.patient?.lastName}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {result.panel?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {result.created_at || result.testedAt
                          ? new Date(
                              result.created_at || result.testedAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {result.created_at || result.testedAt
                          ? new Date(
                              result.created_at || result.testedAt,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                    <FaEye className="text-gray-400" size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Test Results Status
          </h2>

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

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Patients</h2>
          <button
            onClick={() => navigate("/patients")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </button>
        </div>

        {recentPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaUserMd className="mx-auto text-4xl mb-2 text-gray-300" />
            <p>No patients yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUserMd className="text-green-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {patient.firstName} {patient.lastName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    ID: {patient.personalNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
