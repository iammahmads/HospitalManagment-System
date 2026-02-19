import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

// Components
import PatientSignUp from "./patientSignup";
import DoctorSignUp from "./doctorSignup";
import AdminSignUp from "./adminSignup";

// Context
import useUserContext from "../../context/userContext";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { currentRole } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    // 1. If already logged in, redirect to dashboard
    if (currentRole) {
      navigate(`/${currentRole}`);
      return;
    }

    // 2. Check if a role was passed via navigation state
    if (location.state && location.state.userRole) {
      setRole(location.state.userRole);
    } else {
      // If accessed directly without role, go back to get-started
      navigate("/get-started");
    }
  }, [navigate, currentRole, location.state]);

  if (!role) return null; 

  return (
    <main className="min-h-screen flex items-center justify-center bg-designColor1/50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
      >
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 text-white shadow-lg shadow-blue-900/50">
                <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white capitalize">
                {role} Registration
            </h2>
            <p className="text-slate-400 text-sm mt-1">
                Create your account to get started.
            </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
            {role === "admin" ? (
                <AdminSignUp formMode="signup" />
            ) : role === "doctor" ? (
                <DoctorSignUp formMode="signup" />
            ) : (
                <PatientSignUp formMode="signup" />
            )}
        </div>
      </motion.div>
    </main>
  );
};

export default Signup;