import Navbar from "../components/Navbar.jsx";
import Start from "../components/Start.jsx";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const GetStarted = () => {
  const { loggedIn } = useContext(AuthContext);

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Navbar />
      <Start />
    </>
  );
};

export default GetStarted;
