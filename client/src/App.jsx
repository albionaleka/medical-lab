import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./views/Login";
import SendResetOtp from "./views/SendResetOtp";
import Register from "./views/Register";
import GetStarted from "./views/GetStarted";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<SendResetOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
