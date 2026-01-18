import Layout from "../components/Layout/Layout";
import Users from "../components/Users";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UsersPage = () => {
  const { loggedIn } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!loggedIn || !user) {
    return null;
  }

  return (
    <Layout title="User List">
      <Users />
    </Layout>
  );
};

export default UsersPage;
