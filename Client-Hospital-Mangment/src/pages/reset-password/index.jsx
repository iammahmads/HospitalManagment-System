import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, KeyRound, Lock, CheckCheck, Send, Clock, Stethoscope, User } from "lucide-react"; // Import new icons

// Components
import Button from "../../Components/button";
import FormInput from "../../Components/formInput";

// Contexts & Services
import useErrorContext from "../../context/errorContext";
import useUserContext from "../../context/userContext";
import getVerificationCode from "../../services/reset-password/getVerificationCode";
import verifyCode from "../../services/reset-password/verifyCode";

const initialDetails = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
  role: "patient", // Add default role
};

const EmailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX);
const PasswordRegex = new RegExp(import.meta.env.VITE_PASSWORD_REGEX);

export default function ResetPassword({role = "patient"}) {
  const [resetDetails, setResetDetails] = useState(initialDetails);
  const [selectedRole, setSelectedRole] = useState(role); // New state for role
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const { addError, addSuccess } = useErrorContext();
  const { handleSetCookie } = useUserContext();
  const navigate = useNavigate();

  // ---------------- Handlers ------------------

  // Optimized handler for all fields
  const setField = (field) => (e) => {
    setResetDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handler for role selection
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setResetDetails((prev) => ({ ...prev, role }));
  };

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  // Get verification code logic
  const handleGetCode = async () => {
    if (cooldown > 0) {
      addError(`Please wait ${cooldown} seconds before requesting another code`);
      return;
    }

    if (!EmailRegex.test(resetDetails.email)) {
      addError("Please enter a valid email address.");
      return;
    }

    // Start cooldown immediately for better UX
    setCooldown(60);

    // PASS THE SELECTED ROLE to the service
    const { responseData, error } = await getVerificationCode(
      resetDetails.email,
      selectedRole // Pass the role here
    );

    if (error || !responseData.emailSent) {
      addError(error || responseData.message);
      setCooldown(0); // Reset cooldown on error
      return;
    }

    addSuccess("Verification code sent to your email!");
  };

  // Submit reset logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetDetails.password !== resetDetails.confirmPassword) {
      addError("Password and confirm password do not match.");
      return;
    }

    if (!PasswordRegex.test(resetDetails.password)) {
      addError(
        "Password must contain upper/lowercase letters, a number, and a special character."
      );
      return;
    }

    // PASS THE SELECTED ROLE to the service
    const { responseData, error } = await verifyCode(
      resetDetails.email,
      resetDetails.code,
      resetDetails.password,
      selectedRole // Pass the role here
    );

    if (error || !responseData.token) {
      addError(error || responseData.message);
      return;
    }

    handleSetCookie(responseData.token);
    navigate(`/${responseData.role}`);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-designColor1/50 p-4">
      <motion.div
        className="w-full max-w-md p-8 sm:p-10 bg-white rounded-2xl shadow-2xl border border-surface-100"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "var(--color-primary-dark)" }}>
          Reset Password
        </h1>
        <p className="text-center mb-8 text-surface-600">Enter your email to receive a verification code.</p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">

          {/* -------------------------- */}
          {/* NEW: Role Switcher/Selector */}
          {/* -------------------------- */}
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

          {/* Email Input */}
          <label>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-surface-700)" }}>Email Address</p>
            <FormInput
              id="reset_email"
              type="email"
              placeholder="Enter email"
              required
              value={resetDetails.email}
              handleChange={setField("email")}
              icon={<Mail className="w-5 h-5 text-surface-400" />}
            />
          </label>

          {/* Verification Code Section */}
          <div className="space-y-1">
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-surface-700)" }}>Verification Code</p>

            <div className="flex gap-3">
              <div className="flex-grow">
                <FormInput
                  id="reset_code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  value={resetDetails.code}
                  handleChange={setField("code")}
                  icon={<KeyRound className="w-5 h-5 text-surface-400" />}
                />
              </div>

              <Button
                text={cooldown > 0 ? `${cooldown}s` : "Get Code"}
                handleOnClick={handleGetCode}
                disabled={cooldown > 0}
                variant={cooldown > 0 ? "secondary" : "ghost"}
                icon={cooldown > 0 ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                className="w-32 py-2.5 whitespace-nowrap"
              />
            </div>
          </div>

          {/* New Password Input */}
          <label>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-surface-700)" }}>New Password</p>
            <FormInput
              type="password"
              placeholder="Enter new password"
              required
              value={resetDetails.password}
              handleChange={setField("password")}
              icon={<Lock className="w-5 h-5 text-surface-400" />}
            />
          </label>

          {/* Confirm Password Input */}
          <label>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-surface-700)" }}>Confirm Password</p>
            <FormInput
              type="password"
              placeholder="Confirm new password"
              required
              value={resetDetails.confirmPassword}
              handleChange={setField("confirmPassword")}
              icon={<CheckCheck className="w-5 h-5 text-surface-400" />}
            />

            {/* Error message for mismatch */}
            {resetDetails.password &&
              resetDetails.confirmPassword &&
              resetDetails.password !== resetDetails.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>
                  Passwords do not match.
                </p>
              )}
          </label>

          {/* Submit Button */}
          <Button
            text="Reset & Log In"
            type="submit"
            variant="primary"
            className="w-full mt-4"
            icon={<Lock className="w-5 h-5" />}
          />

          {/* Links Footer */}
          <div className="flex justify-between text-xs text-surface-600 pt-1">
            <p>
              Already verified?{" "}
              <Link to="/get-started/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary-dark)" }}>
                Login
              </Link>
            </p>
            <p>
              New here?{" "}
              <Link to="/get-started" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
                Signup
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </main>
  );
}