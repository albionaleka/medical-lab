import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { IoMail } from "react-icons/io5";

const SendResetOtp = () => {
  const [email, setEmail] = useState("");
  const { sendResetOtp } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendResetOtp(email);
  };

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className=" flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 w-full max-w-md">
        <h2 className="text-4xl text-gray-900 font-medium">Reset Password</h2>

        <p className="text-sm text-center text-gray-500/90 p-2 mb-4">
          Enter your email to receive a reset password OTP.
        </p>

        <form className="flex flex-col gap-4 w-90" onSubmit={handleSubmit}>
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <IoMail size={20} color="#6B7280" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendResetOtp;
