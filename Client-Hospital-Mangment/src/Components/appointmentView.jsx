import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  Trash2, 
  AlertCircle, 
  Download 
} from "lucide-react";

// Components
import Loader from "./loader";
import NotFoundPage from "../pages/not-found";
import DownloadInvoicePDF from "./downloadInvoice"; // Assuming this returns a button or link

// Services & Context
import getAppointmentById from "../services/appointment/getById";
import deleteAppointmentById from "../services/appointment/deleteById";
import approveAppointmentById from "../services/appointment/approve";
import addPostDetails from "../services/appointment/addPostDetais";
import createNotification from "../services/notification/createNotification";
import useErrorContext from "../context/errorContext";

// Helper for Status Badge
const StatusBadge = ({ status }) => {
    let styles = "bg-slate-100 text-slate-700";
    if (status === 'scheduled') styles = "bg-green-100 text-green-700 border-green-200";
    if (status === 'pending') styles = "bg-amber-100 text-amber-700 border-amber-200";
    if (status === 'deleted' || status === 'cancelled') styles = "bg-red-100 text-red-700 border-red-200";
    if (status === 'completed') styles = "bg-blue-100 text-blue-700 border-blue-200";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${styles}`}>
            {status}
        </span>
    );
};

export default function AppointmentView({ viewRole = "patient" }) {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { addError } = useErrorContext();

  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [appointmentDetailsFound, setAppointmentDetailsFound] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentPostDetails, setAppointmentPostDetails] = useState("");

  // --- API Calls (Preserved Logic) ---
  const makeDataRequest = async () => {
    setIsLoading(true);
    setAppointmentDetailsFound(false);
    const { responseData, error } = await getAppointmentById(appointmentId);
    
    if (error || !responseData.data) {
      addError(error || responseData.message);
      setIsLoading(false);
      setAppointmentDetailsFound(false);
      return;
    }
    
    setAppointmentDetails(responseData.data);
    setAppointmentPostDetails(responseData.data.details?.post || ""); // Pre-fill if exists
    setIsLoading(false);
    setAppointmentDetailsFound(true);
  };

  const sendNotification = async (fromId, toId, fromName, title, message) => {
    const { responseData, error } = await createNotification({ fromId, toId, fromName, title, message });
    if (error || !responseData.added) addError(error || responseData.message);
  };

  const handleDeleteAppointment = async () => {
    if(!window.confirm("Are you sure you want to delete this appointment?")) return;

    const { responseData, error } = await deleteAppointmentById(appointmentId);
    if (error || !responseData.deleted) {
      addError(error || responseData.message);
      return;
    }
    
    const message = "appointment deleted";
    await sendNotification(
      appointmentDetails.doctorId,
      appointmentDetails.patientId,
      appointmentDetails.doctorName,
      "deletion of appointment",
      message
    );
    navigate(-1);
  };

  const handleApproveAppointment = async () => {
    const { responseData, error } = await approveAppointmentById(appointmentId);
    if (error || !responseData.approved) {
      addError(error);
      return;
    }

    const message = "The doctor has approved your appointment";
    await sendNotification(
      appointmentDetails.doctorId,
      appointmentDetails.patientId,
      appointmentDetails.doctorName,
      "approval of appointment",
      message
    );
    navigate(-1); // Or refresh data
  };

  const handleSubmitPostAppointmentDetails = async (e) => {
    e.preventDefault();
    const { responseData, error } = await addPostDetails(appointmentPostDetails, appointmentId);

    if (error || !responseData.updated) {
      addError(error || responseData.message);
      return;
    }

    const message = "Add post details to appointment: " + appointmentId;
    await sendNotification(
      appointmentDetails.doctorId,
      appointmentDetails.patientId,
      appointmentDetails.doctorName,
      "post details added",
      message
    );
    
    // Ideally refresh local state instead of navigating back, but keeping logic consistent
    makeDataRequest(); 
  };

  useEffect(() => {
    makeDataRequest();
  }, [appointmentId]);


  // --- Render Logic ---

  if (!appointmentDetailsFound && !isLoading) {
    const redirectPath = viewRole === "admin" ? "/admin" : viewRole === "doctor" ? "/doctor" : "/patient";
    return <NotFoundPage redirectTo={redirectPath} />;
  }

  if (isLoading) {
      return <div className="h-screen flex justify-center items-center"><Loader /></div>;
  }

  const formattedDate = new Date(appointmentDetails.dated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const displayTime = appointmentDetails.hoursTime >= 12 
    ? `${appointmentDetails.hoursTime % 12}:00 PM` 
    : `${appointmentDetails.hoursTime}:00 AM`;

  return (
    <div className="flex justify-center p-4 md:p-8 bg-slate-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* 1. Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-3">
                    <StatusBadge status={appointmentDetails.status} />
                    <DownloadInvoicePDF appointmentId={appointmentId}>
                        {/* Assuming this component renders a button, otherwise we wrap it */}
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Download Invoice">
                            <Download className="w-5 h-5" />
                        </button>
                    </DownloadInvoicePDF>
                </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Doctor Info */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Doctor</p>
                        <h2 className="text-xl font-bold text-slate-900">{appointmentDetails.doctorName}</h2>
                        <p className="text-slate-600 text-sm">General Medicine</p> {/* Field placeholder if available */}
                    </div>
                </div>

                {/* Patient Info */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Patient</p>
                        <h2 className="text-xl font-bold text-slate-900">{appointmentDetails.patientName}</h2>
                        {/* Could add Patient ID/CNIC here if available */}
                    </div>
                </div>
            </div>

            {/* Date/Time Bar */}
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{displayTime}</span>
                </div>
            </div>
        </div>

        {/* 2. Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pre-Appointment Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Pre-Appointment Notes
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed min-h-[100px]">
                    {appointmentDetails.details?.pre || <span className="text-slate-400 italic">No notes provided.</span>}
                </div>
            </div>

            {/* Post-Appointment Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Post-Appointment / Diagnosis
                </h3>
                
                {appointmentDetails.details?.postDetailsWritten ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed flex-1">
                        {appointmentDetails.details.post}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {!appointmentDetails.timePassed && appointmentDetails.status !== 'deleted' ? (
                            <div className="flex-1 flex items-center justify-center text-center p-4 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                Notes can be added after the appointment time has passed.
                            </div>
                        ) : appointmentDetails.status === 'deleted' ? (
                             <div className="flex-1 flex items-center justify-center text-center p-4 text-red-500 text-sm bg-red-50 rounded-xl border border-red-100">
                                Appointment cancelled.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitPostAppointmentDetails} className="flex flex-col gap-3 h-full">
                                <textarea 
                                    className="flex-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                                    placeholder="Enter diagnosis, prescription, or notes..."
                                    value={appointmentPostDetails}
                                    onChange={(e) => setAppointmentPostDetails(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                                >
                                    Save Notes
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* 3. Actions Footer (Admin/Doctor Only) */}
        {(viewRole === 'doctor' || viewRole === 'admin') && 
         appointmentDetails.status !== 'deleted' && 
         appointmentDetails.status !== 'completed' && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                {appointmentDetails.status !== 'scheduled' && (
                    <button 
                        onClick={handleApproveAppointment}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-200 transition-all hover:translate-y-[-1px]"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                    </button>
                )}
                
                <button 
                    onClick={handleDeleteAppointment}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all hover:shadow-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Cancel / Delete
                </button>
            </div>
        )}

      </motion.div>
    </div>
  );
}