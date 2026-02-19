import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  CreditCard, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Components
import Loader from "../../Components/loader"; // Ensure this is compatible or use a simple spinner
import Button from "../../Components/button"; // Ensure this accepts standard button props
import FormInput from "../../Components/formInput"; // Assuming this handles styles, or we can inline styles if needed

// Context & Services
import getByCookie from "../../services/patient/getByCookie";
import useErrorContext from "../../context/errorContext";
import getAllDcotors from "../../services/doctor/getAllDoctors";
import dailyDoctorSchedule from "../../services/doctor/dailySchedule";
import createAppointment from "../../services/appointment/create";
import createNotification from "../../services/notification/createNotification";

// Date Constants
const todayDate = new Date().setUTCHours(0, 0, 0, 0);
const minDate = new Date(todayDate + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const maxDate = new Date(todayDate + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const initialAppointmentDetails = {
  doctorId: 0,
  doctorName: "",
  doctorField: "",
  patientName: "",
  patientCnic: 0,
  dated: 0,
  hoursTime: 0,
  status: "pending",
  pre: "",
};

export default function NewAppointment({ viewRole = "patient" }) {
  const [newAppointmentDetails, setNewAppointmentDetails] = useState(initialAppointmentDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [doctorFields, setDoctorFields] = useState([]);
  const [allDoctorsNameAndId, setAllDoctorsNameAndId] = useState([]);
  const [selectedDoctorsNameAndId, setSelectedDoctorsNameAndId] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [selectedDateSchedule, setSelectedDateSchedule] = useState({ appointedHours: [] });
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);

  const navigate = useNavigate();
  const { addError } = useErrorContext();

  // --- Initial Data Loading ---
  const makeDataRequest = async () => {
    setIsLoading(true);
    // Role-based patient data pre-filling
    if (viewRole === "patient") {
      const { reponseData, error } = await getByCookie();
      if (error) { addError(error); setIsLoading(false); return; }
      if (!reponseData.data) { addError(reponseData.message); setIsLoading(false); return; }
      
      setNewAppointmentDetails((prev) => ({
        ...prev,
        patientName: reponseData.data.name,
        patientCnic: reponseData.data.cnic,
      }));
    } else {
      // Admin View: Clear patient data for manual entry
      setNewAppointmentDetails((prev) => ({ ...prev, patientName: "", patientCnic: 0 }));
    }
    setIsLoading(false);
  };

  const makeDoctorFieldsRequest = async () => {
    const { repsonseData, error } = await getAllDcotors(-1, 0);
    if (error) { addError(error); return; }
    if (!repsonseData.data) { addError(repsonseData.message); return; }
    
    const tempFields = [...new Set(repsonseData.data.map((doctor) => doctor.field))]; // Unique fields
    setDoctorFields(tempFields);
    setAllDoctorsNameAndId(repsonseData.data);
  };

  useEffect(() => {
    makeDataRequest();
    makeDoctorFieldsRequest();
  }, []);

  // --- Handlers ---
  const handlePatientNameChange = (e) => setNewAppointmentDetails(prev => ({ ...prev, patientName: e.target.value }));
  const handlePatientCnicChange = (e) => setNewAppointmentDetails(prev => ({ ...prev, patientCnic: e.target.value }));
  const handlePreMessageChange = (e) => setNewAppointmentDetails(prev => ({ ...prev, pre: e.target.value }));

  const handleFieldChange = (e) => {
    const fieldName = e.target.value;
    setNewAppointmentDetails(prev => ({ ...prev, doctorField: fieldName, doctorId: 0, doctorName: "", dated: 0, hoursTime: 0 }));
    setSelectedDoctor({});
    
    const tempDoctors = allDoctorsNameAndId.filter(doc => doc.field === fieldName);
    setSelectedDoctorsNameAndId(tempDoctors);
  };

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doctor = selectedDoctorsNameAndId.find(d => d.id == docId);
    
    setNewAppointmentDetails(prev => ({ ...prev, doctorName: doctor.name, doctorId: doctor.id, dated: 0, hoursTime: 0 }));
    setSelectedDoctor(doctor);
    setSelectedDateSchedule({ appointedHours: [] }); // Reset schedule
  };

  const handleAppointmentDateChange = (e) => {
    const tempDate = new Date(e.target.value).getTime();
    setNewAppointmentDetails(prev => ({ ...prev, dated: tempDate, hoursTime: 0 }));
    makeSelectedDateScheduleDataRequest(tempDate);
  };

  const makeSelectedDateScheduleDataRequest = async (selectedDate) => {
    setIsScheduleLoading(true);
    const { responseData, error } = await dailyDoctorSchedule(selectedDoctor.id, selectedDate);
    if (error) { addError(error); setIsScheduleLoading(false); return; }
    if (!responseData.data) { addError(responseData.message); setIsScheduleLoading(false); return; }
    
    setSelectedDateSchedule(responseData.data);
    setIsScheduleLoading(false);
  };

  const handleTimeSelect = (hour) => {
    setNewAppointmentDetails(prev => ({ ...prev, hoursTime: hour }));
  };

  // --- Submission ---
  const sendNotification = async (title, message) => {
    await createNotification({
      fromId: 1, // Admin/System ID
      toId: newAppointmentDetails.doctorId,
      fromName: "System",
      title: title,
      message: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { responseData, error } = await createAppointment(newAppointmentDetails);
    
    if (error || !responseData.added) {
      addError(error || responseData.message);
      setIsSubmitting(false);
      return;
    }

    // Success Actions
    const msg = `New Appointment request from ${newAppointmentDetails.patientName} (CNIC: ${newAppointmentDetails.patientCnic}).`;
    await sendNotification("New Appointment Request", msg);

    setIsSubmitting(false);
    navigate(viewRole === "admin" ? "/admin/appointments" : "/patient/appointments");
  };

  // --- Helper to format time ---
  const formatTime = (hour) => (hour > 12 ? `${hour % 12} PM` : `${hour} AM`);


  return (
    <div className="flex justify-center p-4 md:p-8 min-h-screen bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                Book New Appointment
            </h1>
            <p className="text-slate-500">Fill in the details below to schedule your visit.</p>
        </div>

        {isLoading ? (
            <div className="flex justify-center h-64 items-center"><Loader /></div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Patient Details Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <User className="w-5 h-5 text-blue-500" /> Patient Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter Patient Name"
                                    value={newAppointmentDetails.patientName}
                                    onChange={handlePatientNameChange}
                                    disabled={viewRole === "patient"} // Locked for patient view
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CNIC Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter CNIC"
                                    value={newAppointmentDetails.patientCnic}
                                    onChange={handlePatientCnicChange}
                                    disabled={viewRole === "patient"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Doctor Selection Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Stethoscope className="w-5 h-5 text-blue-500" /> Select Specialist
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department / Field</label>
                            <select 
                                required 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                onChange={handleFieldChange}
                                value={newAppointmentDetails.doctorField}
                            >
                                <option value="">Select Department...</option>
                                {doctorFields.map((field, i) => (
                                    <option key={i} value={field}>{field}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Available Doctors</label>
                            <select 
                                required 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400"
                                onChange={handleDoctorChange}
                                value={newAppointmentDetails.doctorId || ""}
                                disabled={!newAppointmentDetails.doctorField}
                            >
                                <option value="">Select Doctor...</option>
                                {selectedDoctorsNameAndId.map((doc, i) => (
                                    <option key={i} value={doc.id}>{doc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Schedule Selection Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Clock className="w-5 h-5 text-blue-500" /> Schedule Visit
                    </h3>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                        <input 
                            type="date" 
                            required
                            min={minDate}
                            max={maxDate}
                            className="w-full md:w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                            onChange={handleAppointmentDateChange}
                            disabled={!newAppointmentDetails.doctorId}
                        />
                    </div>

                    {/* Time Slots Grid */}
                    {newAppointmentDetails.dated !== 0 && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Available Time Slots</label>
                            {isScheduleLoading ? (
                                <div className="p-4 text-center text-slate-500 animate-pulse">Loading schedule...</div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {[...Array(selectedDoctor.maxAppointments || 0)].map((_, index) => {
                                        const slotHour = selectedDoctor.appointmentHours?.start + index;
                                        const isBooked = selectedDateSchedule.appointedHours?.includes(index);
                                        const isSelected = newAppointmentDetails.hoursTime === slotHour;

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                disabled={isBooked}
                                                onClick={() => handleTimeSelect(slotHour)}
                                                className={`
                                                    py-2 px-1 text-sm rounded-lg border transition-all
                                                    ${isBooked 
                                                        ? 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed' 
                                                        : isSelected 
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' 
                                                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                                                    }
                                                `}
                                            >
                                                {formatTime(slotHour)}
                                                {isBooked && <span className="block text-[10px] font-bold uppercase mt-0.5">Booked</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {newAppointmentDetails.dated !== 0 && !isScheduleLoading && (!selectedDoctor.maxAppointments) && (
                                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> No schedule available for this doctor yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Additional Notes Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <FileText className="w-5 h-5 text-blue-500" /> Reason for Visit
                    </h3>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 transition-all"
                        placeholder="Briefly describe your symptoms or reason for appointment..."
                        value={newAppointmentDetails.pre}
                        onChange={handlePreMessageChange}
                    />
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit" 
                        text={isSubmitting ? "Processing..." : "Confirm Appointment"} 
                        disabled={isSubmitting || !newAppointmentDetails.hoursTime}
                        variant="primary"
                        className="px-8 py-3 text-lg shadow-lg shadow-blue-500/30"
                        icon={<CheckCircle className="w-5 h-5" />}
                    />
                </div>

            </form>
        )}
      </motion.div>
    </div>
  );
}