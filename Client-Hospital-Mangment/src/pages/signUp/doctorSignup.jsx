import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, CreditCard, Calendar, Stethoscope, GraduationCap, Clock, DollarSign,
  Lock, Check, Info, Minus
} from "lucide-react";

import FormInput from "../../Components/formInput";
import Button from "../../Components/button";
import FormSelecetInput from "../../Components/formSelectInput";
import Loader from "../../Components/loader";

import useErrorContext from "../../context/errorContext";
import useUserContext from "../../context/userContext";
import addDoctor from "../../services/doctor/addDoctor";
import editDoctor from "../../services/doctor/editDoctor";
import getDoctorUsingCookie from "../../services/doctor/getDoctorUsingCookie";

// Hours Helper
const appointmentHoursData = [
  { value: -1, text: "Select Start Time" },
  ...[...Array(24).keys()].map(hour => ({
    value: hour,
    text: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? ' A.M' : ' P.M'}`,
  }))
];

const initialDoctorDetails = {
  name: "", email: "", cnic: "", age: 0, gender: "", field: "", qualification: "",
  maxAppointments: 0, appointmentHoursStart: -1, appointmentHoursEnd: -1,
  about: "", password: "", confirmPassword: "", fee: 0
};

const EmailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX);
const PasswordRegex = new RegExp(import.meta.env.VITE_PASSWORD_REGEX);

export default function DoctorSignUp({ formMode = "signup" }) {
  const [doctorDetails, setDoctorDetails] = useState(initialDoctorDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingDetails, setIsSendingDetails] = useState(false);

  const navigate = useNavigate();
  const { addError, addSuccess } = useErrorContext();
  const { handleSetCookie } = useUserContext();

  // --- Handlers ---
  const handleChange = (key) => (e) => setDoctorDetails(prev => ({ ...prev, [key]: e.target.value }));

  // Specific handlers for logic-heavy fields
  const handleMaxAppointmentsChange = (e) => {
    const val = Number(e.target.value);
    if (doctorDetails.appointmentHoursStart < 0) {
      setDoctorDetails(prev => ({ ...prev, maxAppointments: val }));
    } else {
      setDoctorDetails(prev => ({
        ...prev,
        maxAppointments: val,
        appointmentHoursEnd: prev.appointmentHoursStart + val,
      }));
    }
  };

  const handleAppointmentHoursStartChange = (e) => {
    const val = Number(e.target.value);
    setDoctorDetails(prev => ({
      ...prev,
      appointmentHoursStart: val,
      appointmentHoursEnd: val + prev.maxAppointments,
    }));
  };

  // --- Submit Logic ---
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation 
    if (doctorDetails.name.length < 3) { addError("Name too short"); return; }
    if (!EmailRegex.test(doctorDetails.email)) { addError("Invalid email format"); return; }
    if (formMode === "signup") {
      if (doctorDetails.password !== doctorDetails.confirmPassword) { addError("Passwords do not match"); return; }
      if (!PasswordRegex.test(doctorDetails.password)) { addError("Password is too weak"); return; }
    }

    setIsSendingDetails(true);

    if (formMode === "signup") {
      const { responseData, error } = await addDoctor(doctorDetails);
      if (error || !responseData.token) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Signup success");
      handleSetCookie(responseData.token);
    } else {
      const { responseData, error } = await editDoctor(doctorDetails);
      if (error || !responseData.updated) {
        addError(error || responseData.message);
        setIsSendingDetails(false);
        return;
      }
      addSuccess("Edit success");
      navigate(-1);
    }
    setIsSendingDetails(false);
  };

  // --- Data Loading Logic ---
  const makeDataRequest = async () => {
    setIsLoading(true);

    if (formMode === "signup") {
      setDoctorDetails(initialDoctorDetails);
      setIsLoading(false);
      return;
    }

    if (formMode === "edit") {
      const { responseData, error } = await getDoctorUsingCookie();
      if (error || !responseData.data) {
        addError(error || responseData.message);
        setIsLoading(false);
        return;
      }
      setDoctorDetails({
        ...responseData.data,
        appointmentHoursStart: responseData.data.appointmentHours.start,
        appointmentHoursEnd: responseData.data.appointmentHours.end,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    makeDataRequest();
  }, []);

  if (isLoading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form className="space-y-6" onSubmit={onSubmit}>

        {/* Personal Details */}
        <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Personal Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <FormInput type="text" placeholder="Dr. Jane Doe" value={doctorDetails.name} handleChange={handleChange("name")} icon={<User className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <FormInput type="email" placeholder="email@example.com" value={doctorDetails.email} handleChange={handleChange("email")} icon={<Mail className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNIC Number</label>
              <FormInput type="text" placeholder="12345-1234567-1" value={doctorDetails.cnic} handleChange={handleChange("cnic")} icon={<CreditCard className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <FormInput type="number" placeholder="35" value={doctorDetails.age} handleChange={handleChange("age")} icon={<Calendar className="w-4 h-4 text-slate-400" />} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <FormSelecetInput handleOnChange={handleChange("gender")} value={doctorDetails.gender} options={[{ value: "", text: "Select" }, { value: "male", text: "Male" }, { value: "female", text: "Female" }]} />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" /> Professional & Scheduling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialization Field</label>
              <FormInput type="text" placeholder="e.g. Cardiology" value={doctorDetails.field} handleChange={handleChange("field")} icon={<Stethoscope className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
              <FormInput type="text" placeholder="e.g. MBBS, FCPS" value={doctorDetails.qualification} handleChange={handleChange("qualification")} icon={<GraduationCap className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee (PKR)</label>
              <FormInput type="number" placeholder="e.g. 1500" value={doctorDetails.fee} handleChange={handleChange("fee")} icon={<DollarSign className="w-4 h-4 text-slate-400" />} required />
            </div>

            {/* Scheduling */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Appts/Hour</label>
              <FormInput type="number" placeholder="1-5" value={doctorDetails.maxAppointments} handleChange={handleMaxAppointmentsChange} icon={<Info className="w-4 h-4 text-slate-400" />} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shift Start Time</label>
              <FormSelecetInput handleOnChange={handleAppointmentHoursStartChange} value={doctorDetails.appointmentHoursStart} options={appointmentHoursData} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shift End Time</label>
              <FormInput value={doctorDetails.appointmentHoursEnd > 0 ? (doctorDetails.appointmentHoursEnd > 12 ? `${doctorDetails.appointmentHoursEnd % 12} PM` : `${doctorDetails.appointmentHoursEnd} AM`) : "N/A"} disabled icon={<Clock className="w-4 h-4 text-slate-400" />} />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
            <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={doctorDetails.about} onChange={handleChange("about")} placeholder="Briefly describe your experience..." />
          </div>
        </div>

        {/* Security (Signup Only) */}
        {formMode === "signup" && (
          <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-600" /> Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <FormInput type="password" placeholder="Create password" value={doctorDetails.password} handleChange={handleChange("password")} icon={<Lock className="w-4 h-4 text-slate-400" />} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <FormInput type="password" placeholder="Repeat password" value={doctorDetails.confirmPassword} handleChange={handleChange("confirmPassword")} icon={<Check className="w-4 h-4 text-slate-400" />} required />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-4 mt-6">
          {formMode === "signup" && (
            <p className="text-center text-sm text-slate-600">
              Already have an account? <Link to="/get-started/login" className="text-blue-600 font-semibold hover:underline">Log In</Link>
            </p>
          )}
          <Button type="submit" text={formMode === "signup" ? "Register" : "Update Profile"} loading={isSendingDetails} disabled={isSendingDetails} variant="primary" className="w-full" />
        </div>
      </form>
    </motion.div>
  );
}