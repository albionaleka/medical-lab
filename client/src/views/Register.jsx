import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import lab from "../assets/chem-lab.svg";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.role);
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4 py-8">
      <div className="flex flex-col bg-white lg:flex-row w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        <div className="w-full lg:w-2/5 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
              Create Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <IoMail size={20} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="Your Email Address"
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <IoIosLock size={20} />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="Your Password"
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none z-10">
                    <FaUserMd size={20} />
                  </span>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Your Role
                    </option>
                    <option value="LABORANT">Laborant</option>
                    <option value="DOCTOR">Doctor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Log In!
              </a>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-400 items-center justify-center rounded-l-full p-16 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-center w-full h-full max-w-2xl">
            <div className="text-center">
              <img
                src={lab}
                alt="Lab Illustration"
                className="w-64 mx-auto mb-6"
              />
              <p className="text-white text-lg font-medium opacity-90">
                Join us to manage medical records with ease and security.
              </p>
            </div>
          </div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
