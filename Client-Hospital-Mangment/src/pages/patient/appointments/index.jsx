import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Plus, Clock, Calendar, Activity } from "lucide-react";

// Components
import AppointmentTable from "../../../Components/appointmentsTable";
import Loader from "../../../Components/loader";

// Services & Context
import getAllAppointments from "../../../services/appointment/getAll";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);

  const { addError } = useErrorContext();

  const makePatientAppointmentRequest = async () => {
    setIsLoading(true);
    const { reponseData, error } = await getAllAppointments(
      itemsToShowAtATime,
      itemsRange.start
    );
    
    if (error) {
      addError(error);
      setIsLoading(false);
      return;
    }
    
    if (!reponseData.data) {
      addError(reponseData.message);
      setIsLoading(false);
      return;
    }

    setTotalItems(reponseData.count);
    setAppointments(reponseData.data);
    setIsLoading(false);
  };

  useEffect(() => {
    makePatientAppointmentRequest();
  }, [itemsRange]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-8 h-8 text-blue-600" />
            My Appointments
          </h1>
          <p className="text-slate-500 mt-1">
            View your history and schedule new consultations.
          </p>
        </div>
        
        {/* Primary Action: Book New */}
        <Link 
          to="/patient/appointments/new" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </Link>
      </motion.div>

      {/* 2. Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Toolbar / Stats */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Scheduled Visits</span>
            </div>

            {/* Quick Stat */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium shadow-sm">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Total: {totalItems}</span>
            </div>
        </div>

        {/* Table Content */}
        <div className="p-1">
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader />
                </div>
            ) : appointments.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No appointments yet</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                        You haven't scheduled any appointments with our doctors yet.
                    </p>
                    <Link 
                      to="/patient/appointments/new" 
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Book your first visit &rarr;
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Reusing the Redesigned AppointmentTable */}
                    <AppointmentTable
                        appointments={appointments}
                        itemsToShowAtATime={itemsToShowAtATime}
                        totalItems={totalItems}
                        itemsRange={itemsRange}
                        tableTitle="" // Handled by header
                        viewRole="patient"
                        setItemsRange={setItemsRange}
                    />
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}