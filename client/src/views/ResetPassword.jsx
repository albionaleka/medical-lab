import { useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import lab from "../assets/chem-lab.svg";

const ResetPassword = () => {
  const nav = useNavigate();
  const refs = useRef([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [submitOtp, setSubmitOtp] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value && index < refs.current.length - 1) {
      refs.current[index + 1].focus();
    }
  };

  const keyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((el, index) => {
      if (refs.current[index]) {
        refs.current[index].value = el;
      }
    });
  };

  const sendOTP = async (e) => {
    try {
      e.preventDefault();
      const { data } = await api.post("/api/auth/reset-otp", { email });

      if (data.message) {
        toast.success("OTP sent to your email");
        setEmailSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    }
  };

  const submitOTP = (e) => {
    e.preventDefault();
    const otpArray = refs.current.map((e) => e.value);
    const otpCode = otpArray.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setOtp(otpCode);
    setSubmitOtp(true);
  };

  const reset = async (e) => {
    try {
      e.preventDefault();

      const { data } = await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      if (data.message) {
        toast.success("Password reset successfully");
        nav("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password");
      setEmailSent(false);
      setSubmitOtp(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4 py-8">
      <div className="flex flex-col bg-white lg:flex-row w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        <div className="w-full lg:w-2/5 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white">
          <div className="w-full max-w-sm">
            {!emailSent && (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                  Enter your email address to receive a password reset code
                </p>

                <form onSubmit={sendOTP} className="space-y-5">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email Address"
                        required
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                  >
                    Send OTP
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Log In
                  </a>
                </p>
              </>
            )}

            {!submitOtp && emailSent && (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Enter OTP
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                  We sent a 6-digit code to {email}
                </p>

                <form onSubmit={submitOTP} className="space-y-5">
                  <div
                    className="flex justify-between gap-2"
                    onPaste={handlePaste}
                  >
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          ref={(e) => (refs.current[index] = e)}
                          onInput={(e) => handleInput(e, index)}
                          onKeyDown={(e) => keyDown(e, index)}
                        />
                      ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                  >
                    Verify OTP
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Resend
                  </button>
                </p>
              </>
            )}

            {submitOtp && emailSent && (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  New Password
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                  Enter your new password
                </p>

                <form onSubmit={reset} className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FaLock size={20} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your New Password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                  >
                    Reset Password
                  </button>
                </form>
              </>
            )}
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
                Secure password recovery for your account.
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

export default ResetPassword;
