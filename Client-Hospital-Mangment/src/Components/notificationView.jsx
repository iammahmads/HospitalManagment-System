import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ShieldAlert 
} from "lucide-react";

// Components
import Loader from "./loader";
import NotFoundPage from "../pages/not-found";

// Services & Context
import getNotificationById from "../services/notification/getById";
import useErrorContext from "../context/errorContext";

export default function NotificationView({ viewRole = "patient" }) {
  const params = useParams();
  const { notificationId } = params;

  const [notificationDetails, setNotificationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notificationFound, setNotificationFound] = useState(true);

  const navigate = useNavigate();
  const { addError } = useErrorContext();

  const makeDataRequest = async () => {
    // setIsLoading(true); // Ensure loading state is set at start
    const { responseData, error } = await getNotificationById(notificationId);
    
    if (error) {
      addError(error);
      setIsLoading(false);
      setNotificationFound(false);
      return;
    }
    if (!responseData.data) {
      addError(responseData.message);
      setIsLoading(false);
      setNotificationFound(false);
      return;
    }
    setNotificationDetails(responseData.data);
    setIsLoading(false);
    setNotificationFound(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!notificationId) return;
    makeDataRequest();
  }, [notificationId]);

  // --- Redirect Logic for 404 ---
  if (!notificationFound && !isLoading) {
    const redirectPath = viewRole === "admin" ? "/admin" : viewRole === "doctor" ? "/doctor" : "/patient";
    return <NotFoundPage redirectTo={redirectPath} />;
  }

  // Helper for Date Formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return {
        full: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const { full: dateStr, time: timeStr } = formatDate(notificationDetails.dated);

  return (
    <div className="w-full flex justify-center p-4 md:p-8">
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
            <Loader />
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
            {/* 1. Header / Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-4">
                <button 
                    onClick={handleGoBack}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Notification Details
                </h1>
            </div>

            {/* 2. Message Meta Data */}
            <div className="p-6 md:p-8 space-y-6">
                
                {/* Title */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2">
                        {notificationDetails.title}
                    </h2>
                    
                    {/* Meta Row: Sender & Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-500 mt-3">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 w-fit">
                            <User className="w-4 h-4" />
                            <span className="font-medium">From: {notificationDetails.fromName || "System Admin"}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {dateStr}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {timeStr}
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* 3. Message Body */}
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed min-h-[150px]">
                    {/* Render message content nicely. If it has newlines, preserve them. */}
                    <p className="whitespace-pre-wrap text-base md:text-lg">
                        {notificationDetails.message}
                    </p>
                </div>

                {/* 4. Footer / Signature */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Sent by</p>
                        <p className="font-semibold text-slate-800 text-lg">
                            {notificationDetails.fromName}
                        </p>
                        <p className="text-sm text-slate-500 font-mono">
                            ID: {notificationDetails.from}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
      )}
    </div>
  );
}