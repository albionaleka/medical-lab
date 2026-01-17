import { useContext } from "react";
import Layout from "../components/Layout/Layout";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import DoctorDashboard from "../components/Dashboard/DoctorDashboard";
import LaborantDashboard from "../components/Dashboard/LaborantDashboard";
import { ROLES } from "../utils/roles";

const Dashboard = () => {
  const { loggedIn } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!loggedIn || !user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.DOCTOR:
        return <DoctorDashboard />;
      case ROLES.LABORANT:
        return <LaborantDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return <Layout title="Dashboard">{renderDashboard()}</Layout>;
};

export default Dashboard;
