import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, CreditCard, Calendar, Venus, Lock, Check, ShieldCheck } from "lucide-react";

import FormInput from "../../Components/formInput";
import Button from "../../Components/button";
import FormSelecetInput from "../../Components/formSelectInput";
import Loader from "../../Components/loader"; 

import useErrorContext from "../../context/errorContext";
import useUserContext from "../../context/userContext";
import addAdmin from "../../services/admin/signup"; 
import editAdmin from "../../services/admin/edit"; 
import getAdminUsingCookie from "../../services/admin/getAdminUsingCookie";

const initialAdminDetails = { name: "", email: "", cnic: "", age: 0, gender: "", password: "", confirmPassword: "" };

const EmailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX);
const PasswordRegex = new RegExp(import.meta.env.VITE_PASSWORD_REGEX);

export default function AdminSignUp({ formMode = "signup" }) {
  const [adminDetails, setAdminDetails] = useState(initialAdminDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingDetails, setIsSendingDetails] = useState(false);

  const navigate = useNavigate();
  const { addError, addSuccess } = useErrorContext();
  const { handleSetCookie } = useUserContext();

  const handleChange = (key) => (e) => setAdminDetails(prev => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (adminDetails.name.length < 3) { addError("Name too short"); return; }
    if (formMode === "signup" && adminDetails.password !== adminDetails.confirmPassword) { addError("Passwords mismatch"); return; }

    setIsSendingDetails(true);

    if (formMode === "signup") {
      const { responseData, error } = await addAdmin(adminDetails);
      if (error || !responseData.token) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Signup success");
      handleSetCookie(responseData.token);
    } else {
      const { responseData, error } = await editAdmin(adminDetails);
      if (error || !responseData.updated) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Profile updated");
      navigate(-1);
    }
    setIsSendingDetails(false);
  };

  // --- THE FIX ---
  const makeDataRequest = async () => {
    setIsLoading(true);
    if (formMode === "signup") {
      setAdminDetails(initialAdminDetails);
      setIsLoading(false); // Fix
      return;
    } 
    
    if (formMode === "edit") {
      const { responseData, error } = await getAdminUsingCookie();
      if (error || !responseData.data) {
        addError(error || responseData.message);
        setIsLoading(false);
        return;
      }
      setAdminDetails(responseData.data);
      setIsLoading(false);
    }
  };

  useEffect(() => { makeDataRequest(); }, []);

  if (isLoading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /> Admin Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" value={adminDetails.name} handleChange={handleChange("name")} icon={<User className="w-4 h-4" />} required />
                <FormInput label="Email" type="email" value={adminDetails.email} handleChange={handleChange("email")} icon={<Mail className="w-4 h-4" />} required />
                <FormInput label="CNIC" value={adminDetails.cnic} handleChange={handleChange("cnic")} icon={<CreditCard className="w-4 h-4" />} required />
                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Age" type="number" value={adminDetails.age} handleChange={handleChange("age")} icon={<Calendar className="w-4 h-4" />} required />
                    <FormSelecetInput label="Gender" handleOnChange={handleChange("gender")} value={adminDetails.gender} options={[{ value: "", text: "Select" }, { value: "male", text: "Male" }, { value: "female", text: "Female" }]} />
                </div>
            </div>
        </div>

        {formMode === "signup" && (
            <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-600" /> Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Password" type="password" value={adminDetails.password} handleChange={handleChange("password")} icon={<Lock className="w-4 h-4" />} required />
                    <FormInput label="Confirm Password" type="password" value={adminDetails.confirmPassword} handleChange={handleChange("confirmPassword")} icon={<Check className="w-4 h-4" />} required />
                </div>
            </div>
        )}

        <div className="flex flex-col gap-4 mt-6">
            {formMode === "signup" && (
                <p className="text-center text-sm text-slate-600">Already have an account? <Link to="/get-started/login" className="text-blue-600 font-semibold hover:underline">Log In</Link></p>
            )}
            <Button type="submit" text={formMode === "signup" ? "Create Account" : "Save Changes"} loading={isSendingDetails} disabled={isSendingDetails} variant="primary" className="w-full" />
        </div>
      </form>
    </motion.div>
  );
}