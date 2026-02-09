import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./views/Login";
import SendResetOtp from "./views/SendResetOtp";
import ResetPassword from "./views/ResetPassword";
import Register from "./views/Register";
import GetStarted from "./views/GetStarted";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import UserProfile from "./views/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./views/UsersPage";
import PatientsPage from "./views/PatientsPage";
import PatientDetailsPage from "./views/PatientDetailsPage";
import Tests from "./views/Tests";
import TestResultsPage from "./views/TestResultsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<SendResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
          path="/profile/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserProfile />
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
          path="/tests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "LABORANT"]}>
              <Tests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/test-results"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "LABORANT", "DOCTOR"]}>
              <TestResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "LABORANT", "DOCTOR"]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "LABORANT", "DOCTOR"]}>
              <PatientDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
