import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Stethoscope, 
  GraduationCap, 
  DollarSign, 
  CheckCircle, 
  Info, 
  Award 
} from "lucide-react";

// Components
import Loader from "./loader";
import NotFoundPage from "../pages/not-found";

// Services & Context
import getDoctorById from "../services/doctor/getById";
import approveDoctorById from "../services/doctor/approve";
import createNotification from "../services/notification/createNotification";
import useErrorContext from "../context/errorContext";

// Placeholder image if none provided
import USER_PROFILE from "/user-regular.png"; 

export default function DoctorView({ viewRole = "patient" }) {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { addError } = useErrorContext();

  const [doctorDetails, setDoctorDetails] = useState({});
  const [doctorDetailsFound, setDoctorDetailsFound] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // --- API Calls ---
  const makeDataRequest = async () => {
    setIsLoading(true);
    setDoctorDetailsFound(false);
    
    const { responseData, error } = await getDoctorById(doctorId);
    
    if (error || !responseData.data) {
      addError(error || responseData.message);
      setIsLoading(false);
      setDoctorDetailsFound(false);
      return;
    }
    
    setDoctorDetails(responseData.data);
    setIsLoading(false);
    setDoctorDetailsFound(true);
  };

  const sendNotification = async (fromId, toId, fromName, title, message) => {
    const { responseData, error } = await createNotification({ fromId, toId, fromName, title, message });
    if (error || !responseData.added) {
        addError(error || responseData.message);
    }
  };

  const handleApproveDoctor = async () => {
    const { responseData, error } = await approveDoctorById(doctorId);
    if (error || !responseData.approved) {
      addError(error || responseData.message);
      return;
    }

    // Send notification
    const message = "You have been approved by admin";
    await sendNotification(1, doctorDetails.id, doctorDetails.name, "Approval of Doctor", message);

    navigate(-1); // Or reload data
  };

  useEffect(() => {
    makeDataRequest();
  }, [doctorId]);

  // --- Render Logic ---
  if (!doctorDetailsFound && !isLoading) {
    const redirectPath = viewRole === "admin" ? "/admin" : viewRole === "doctor" ? "/doctor" : "/patient";
    return <NotFoundPage redirectTo={redirectPath} />;
  }

  if (isLoading) {
      return <div className="h-screen flex justify-center items-center"><Loader /></div>;
  }

  return (
    <div className="flex justify-center p-4 md:p-8 min-h-screen bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header / Cover Area */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 md:h-40 relative">
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            <div className="px-6 md:px-10 pb-10 relative">
                {/* Profile Image - Overlapping Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 md:-mt-16 mb-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden shrink-0">
                        <img 
                            src={USER_PROFILE} 
                            alt="Doctor Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    
                    <div className="flex-1 pt-2 md:pt-16">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{doctorDetails.name}</h1>
                                <div className="flex items-center gap-2 text-blue-600 font-medium mt-1">
                                    <Stethoscope className="w-4 h-4" />
                                    <span>{doctorDetails.field}</span>
                                </div>
                            </div>

                            {/* Approval Action (Admin Only) */}
                            {doctorDetails.status === "pending" && (
                                <button 
                                    onClick={handleApproveDoctor}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Approve Doctor
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    
                    {/* Professional Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-500" /> Professional Details
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Qualification</label>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <GraduationCap className="w-5 h-5 text-slate-400" />
                                    <span className="font-medium">{doctorDetails.qualification}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Consultation Fee</label>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <DollarSign className="w-5 h-5 text-slate-400" />
                                    <span className="font-medium text-lg text-emerald-600">PKR {doctorDetails.fee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" /> Biography
                        </h3>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-sm">
                            {doctorDetails.about || <span className="italic text-slate-400">No biography provided.</span>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </motion.div>
    </div>
  );
}