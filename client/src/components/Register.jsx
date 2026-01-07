import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await register(formData.email, formData.password, formData.role);
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <form
          className="md:w-96 w-80 flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl text-gray-900 font-medium">Register</h2>
          <p className="text-sm text-gray-500/90 text-center mt-3 mb-6">
            Welcome to Medica! Please create an account to continue
          </p>

          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <IoMail size={20} color="#6B7280" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <IoIosLock size={20} color="#6B7280" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={onChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="w-full flex items-center justify-center gap-4 mt-6 text-gray-500/80">
            <select
              name="role"
              value={formData.role || ""}
              onChange={onChange}
              className="w-full border border-gray-300/60 h-12 rounded-full pl-6 text-gray-500/80 outline-none text-sm"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value={"LABORANT"}>Laborant</option>
              <option value={"DOCTOR"}>Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            Register
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <a className="text-indigo-400 hover:underline" href="/login">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
