import Layout from "../components/Layout/Layout";
import Patients from "../components/Patients";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PatientsPage = () => {
    const { loggedIn } = useContext(AuthContext);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!loggedIn || !user) {
        return null;
    }

    return (
        <Layout title="Patient Management">
            <Patients />
        </Layout>
    );
};

export default PatientsPage;
