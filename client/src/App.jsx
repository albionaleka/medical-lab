import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./views/Login";
import SendResetOtp from "./views/SendResetOtp";
import Register from "./views/Register";
import GetStarted from "./views/GetStarted";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./views/UsersPage";
import PatientsPage from "./views/PatientsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<SendResetOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
