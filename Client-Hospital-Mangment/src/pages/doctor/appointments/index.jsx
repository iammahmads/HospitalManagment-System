import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, Activity, Calendar } from "lucide-react";

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

  const makeAppointmentsDataRequest = async () => {
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
    makeAppointmentsDataRequest();
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
            Manage your daily schedule and patient consultations.
          </p>
        </div>
        
        {/* Stats Widget */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Scheduled</p>
                <p className="text-xl font-bold text-slate-900 leading-none">{totalItems}</p>
            </div>
        </div>
      </motion.div>

      {/* 2. Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Toolbar (Visual Only) */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Upcoming Schedule</span>
        </div>

        {/* Table Content */}
        <div className="p-1">
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader />
                </div>
            ) : appointments.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
                    <p className="text-slate-500 mt-1">
                        You have no appointments scheduled for this period.
                    </p>
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
                        viewRole="doctor"
                        setItemsRange={setItemsRange}
                    />
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}