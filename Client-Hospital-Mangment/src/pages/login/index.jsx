import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Stethoscope, User } from "lucide-react"; // Import new icons

import LOGO from "/logo.jpg";
import login from "../../services/login";

import useErrorContext from "../../context/errorContext";
import useUserContext from "../../context/userContext";

import FormInput from "../../Components/formInput";
import Button from "../../Components/button";

const initialDetails = {
  email: "",
  password: "",
  role: "patient", // Set default role
};

// Animation for the form card
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};


export default function LoginPage({ role = "patient" }) {
  const [loginDetails, setLoginDetails] = useState(initialDetails);
  // Separate state for the selected role for easier handling/UI
  const [selectedRole, setSelectedRole] = useState(role);

  const { addError } = useErrorContext();
  const { handleSetCookie, currentRole } = useUserContext();
  const navigate = useNavigate();

  // --------------------------
  //  Handle Role Change
  // --------------------------
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLoginDetails((prev) => ({ ...prev, role }));
  };

  // --------------------------
  //  Handle Login Submission
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the current selected role is used in the final submission
    const dataToSend = { ...loginDetails, role: selectedRole };

    // NOTE: You must update your 'login' service to accept the role parameter.
    const { responseData, error } = await login(dataToSend);

    if (error) {
      addError(error);
      return;
    }
    if (!responseData.token) {
      addError(responseData.message);
      return;
    }

    await handleSetCookie(responseData.token);
    navigate(`/${responseData.role}`);
  };

  // --------------------------
  //  Redirect if already logged in
  // --------------------------
  useEffect(() => {
    if (currentRole) {
      navigate(`/${currentRole}`);
    }
  }, [currentRole, navigate]);

  // --------------------------
  //  Controlled Input Handlers
  // --------------------------
  const handleEmailChange = (e) =>
    setLoginDetails((prev) => ({ ...prev, email: e.target.value }));

  const handlePasswordChange = (e) =>
    setLoginDetails((prev) => ({ ...prev, password: e.target.value }));

  return (
    <main className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOGO})` }}
      >
        <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-lg" />
      </div>

      {/* Login Card */}
      <motion.div
        className="w-full max-w-md p-8 sm:p-10 bg-white/95 rounded-2xl shadow-2xl relative z-10 border border-surface-100"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={LOGO}
            alt="Hospital Logo"
            className="w-16 h-16 object-contain rounded-full mb-3"
          />
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--color-primary-dark)" }}
          >
            Welcome Back
          </h1>
          <p className="text-center text-surface-600 text-sm">
            Access your secure portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* -------------------------- */}
          {/* NEW: Role Switcher/Selector */}
          {/* -------------------------- */}
          {
            selectedRole !== "admin" &&
            <div className="mb-4">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--color-surface-700)" }}
              >
                Select your Role
              </p>
              <div className="flex bg-surface-100 rounded-lg p-1 space-x-1">
                {/* Patient Button */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("patient")}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all duration-200 text-sm font-semibold ${selectedRole === "patient"
                    ? "bg-secondary shadow-md text-primary-dark"
                    : "text-surface-600 hover:text-surface-800"
                    }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Patient
                </button>
                {/* Doctor Button */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("doctor")}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all duration-200 text-sm font-semibold ${selectedRole === "doctor"
                    ? "bg-secondary shadow-md text-primary-dark"
                    : "text-surface-600 hover:text-surface-800"
                    }`}
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Doctor
                </button>
              </div>
            </div>
          }

          {/* Email */}
          <label htmlFor="login_email">
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-surface-700)" }}
            >
              Email Address
            </p>
            <FormInput
              id="login_email"
              type="email"
              placeholder="Enter email"
              value={loginDetails.email}
              required
              handleChange={handleEmailChange}
              icon={<Mail className="w-5 h-5 text-surface-400" />}
            />
          </label>

          {/* Password */}
          <label htmlFor="login_password">
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-surface-700)" }}
            >
              Password
            </p>
            <FormInput
              id="login_password"
              type="password"
              placeholder="Enter password"
              value={loginDetails.password}
              required
              handleChange={handlePasswordChange}
              icon={<Lock className="w-5 h-5 text-surface-400" />}
            />
          </label>

          {/* Links */}
          {
            selectedRole !== "admin" &&
            <div className="flex justify-between items-center text-xs text-surface-600 pt-1">
              <Link
                to="/get-started/reset"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary-dark)" }}
              >
                Forgot Password?
              </Link>

              <span>
                New user?{" "}
                <Link
                  to="/get-started"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Sign up
                </Link>
              </span>
            </div>
          }

          {/* Submit */}
          <Button
            text="Login to Portal"
            type="submit"
            variant="primary"
            className="w-full mt-4"
            icon={<LogIn className="w-5 h-5" />}
          />
        </form>
      </motion.div>
    </main>
  );
}