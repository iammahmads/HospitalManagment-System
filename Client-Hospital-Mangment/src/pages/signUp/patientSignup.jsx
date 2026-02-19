import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, CreditCard, Calendar, Venus, MapPin, Lock, CheckCircle, ArrowRight 
} from "lucide-react";

// Components
import FormInput from "../../Components/formInput";
import Button from "../../Components/button";
import FormSelecetInput from "../../Components/formSelectInput";
import Loader from "../../Components/loader"; 

// Services & Context
import useErrorContext from "../../context/errorContext";
import useUserContext from "../../context/userContext";
import addPatient from "../../services/patient/addPatient";
import editPatient from "../../services/patient/editDetails";
import getByCookie from "../../services/patient/getByCookie";

const initialPatientDetails = {
  name: "", email: "", cnic: "", age: 0, gender: "", address: "", password: "", confirmPassword: "",
};

const EmailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX);
const PasswordRegex = new RegExp(import.meta.env.VITE_PASSWORD_REGEX);

export default function PatientSignUp({ formMode = "signup" }) {
  const [patientDetails, setPatientDetails] = useState(initialPatientDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingDetails, setIsSendingDetails] = useState(false);

  const navigate = useNavigate();
  const { addError, addSuccess } = useErrorContext();
  const { handleSetCookie } = useUserContext();

  const handleChange = (key) => (e) => setPatientDetails(prev => ({ ...prev, [key]: e.target.value }));

  // --- Submit Logic ---
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (patientDetails.name.length < 3) { addError("Name must be at least 3 characters"); return; }
    if (!EmailRegex.test(patientDetails.email)) { addError("Invalid email format"); return; }
    if (patientDetails.cnic.length !== 13) { addError("CNIC must be 13 digits"); return; }
    
    if (formMode === "signup") {
        if (patientDetails.password !== patientDetails.confirmPassword) { addError("Passwords do not match"); return; }
        if (!PasswordRegex.test(patientDetails.password)) { addError("Password is too weak"); return; }
    }

    setIsSendingDetails(true);

    if (formMode === "signup") {
      const { responseData, error } = await addPatient(patientDetails);
      if (error || !responseData.token) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Account created successfully!");
      handleSetCookie(responseData.token);
    } else {
      const { responseData, error } = await editPatient(patientDetails);
      if (error || !responseData.updated) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Profile updated successfully!");
      navigate(-1);
    }
    setIsSendingDetails(false);
  };

  // --- Data Loading ---
  const makeDataRequest = async () => {
    setIsLoading(true);
    if (formMode === "signup") {
      setPatientDetails(initialPatientDetails);
      setIsLoading(false);
      return;
    } 
    if (formMode === "edit") {
      const { reponseData, error } = await getByCookie();
      if (error || !reponseData.data) {
        addError(error || reponseData.message);
        setIsLoading(false);
        return;
      }
      setPatientDetails(reponseData.data);
      setIsLoading(false);
    }
  };

  useEffect(() => { makeDataRequest(); }, []);

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {formMode === "signup" ? "Patient Registration" : "Edit Profile"}
        </h2>
        <p className="text-slate-500">
            {formMode === "signup" 
                ? "Please fill in your details to create a new patient account."
                : "Update your personal information below."
            }
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
                    <FormInput 
                        type="text" 
                        placeholder="e.g. Muhammad Asad" 
                        value={patientDetails.name} 
                        handleChange={handleChange("name")} 
                        icon={<User className="w-4 h-4 text-slate-400" />} 
                        required 
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                    <FormInput 
                        type="email" 
                        placeholder="asad@example.com" 
                        value={patientDetails.email} 
                        handleChange={handleChange("email")} 
                        icon={<Mail className="w-4 h-4 text-slate-400" />} 
                        required 
                    />
                </div>

                {/* CNIC Field */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">CNIC Number</label>
                    <FormInput 
                        type="text"
                        placeholder="e.g. 12345-1234567-1 (13 digits)" 
                        value={patientDetails.cnic} 
                        handleChange={handleChange("cnic")} 
                        icon={<CreditCard className="w-4 h-4 text-slate-400" />} 
                        required 
                    />
                </div>
            </div>
        </div>

        {/* Section 2: Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Demographics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Age Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Age</label>
                    <FormInput 
                        type="number" 
                        placeholder="e.g. 25" 
                        value={patientDetails.age} 
                        handleChange={handleChange("age")} 
                        icon={<Calendar className="w-4 h-4 text-slate-400" />} 
                        required 
                    />
                </div>

                {/* Gender Field */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Gender</label>
                    <FormSelecetInput 
                        handleOnChange={handleChange("gender")} 
                        value={patientDetails.gender} 
                        options={[
                            { value: "", text: "Select Gender" }, 
                            { value: "male", text: "Male" }, 
                            { value: "female", text: "Female" }
                        ]} 
                        icon={<Venus className="w-4 h-4 text-slate-400" />}
                    />
                </div>

                {/* Address Field */}
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Residential Address</label>
                    <FormInput 
                        type="text"
                        placeholder="House No, Street, City..." 
                        value={patientDetails.address} 
                        handleChange={handleChange("address")} 
                        icon={<MapPin className="w-4 h-4 text-slate-400" />} 
                    />
                </div>
            </div>
        </div>

        {/* Section 3: Security (Signup Only) */}
        {formMode === "signup" && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="bg-blue-50 p-6 rounded-2xl border border-blue-100"
            >
                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Account Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1.5 ml-1">Password</label>
                        <FormInput 
                            type="password" 
                            placeholder="Create a strong password" 
                            value={patientDetails.password} 
                            handleChange={handleChange("password")} 
                            required 
                            icon={<Lock className="w-4 h-4 text-blue-400" />}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1.5 ml-1">Confirm Password</label>
                        <FormInput 
                            type="password" 
                            placeholder="Re-enter your password" 
                            value={patientDetails.confirmPassword} 
                            handleChange={handleChange("confirmPassword")} 
                            required 
                            icon={<CheckCircle className="w-4 h-4 text-blue-400" />}
                        />
                    </div>
                </div>
                <p className="text-xs text-blue-600/80 mt-4 ml-1">
                    * Password must contain at least 8 characters, including numbers and symbols.
                </p>
            </motion.div>
        )}

        {/* Action Area */}
        <div className="pt-4 flex flex-col items-center gap-4">
            <Button 
                type="submit" 
                text={formMode === "signup" ? "Create Account" : "Save Changes"} 
                disabled={isSendingDetails} 
                loading={isSendingDetails} 
                variant="primary" 
                className="w-full md:w-auto md:px-12 py-3 text-lg shadow-lg shadow-blue-500/20"
                icon={formMode === "signup" ? <ArrowRight className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            />
            
            {formMode === "signup" && (
                <p className="text-slate-500 text-sm">
                    Already registered? <Link to="/get-started/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
                </p>
            )}
        </div>

      </form>
    </motion.div>
  );
}