import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Plus, Clock, Calendar, Filter } from "lucide-react";

// Components
import AppointmentTable from "../../../Components/appointmentsTable";
import Loader from "../../../Components/loader";

// Services & Context
import getAllAppointments from "../../../services/appointment/getAll";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function Appointments() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [apopintmentStatus, setAppointmentStatus] = useState("all")

  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);

  const { addError } = useErrorContext();

  // --- Data Fetching ---
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

  let filtedAppointments = appointments;
  if (["scheduled", "pending"].includes(apopintmentStatus)) {
    filtedAppointments = appointments.filter((e) => e.status === apopintmentStatus)
  }

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
            Appointment Scheduling
          </h1>
          <p className="text-slate-500 mt-1">
            Manage patient bookings, rescheduling, and status updates.
          </p>
        </div>

        {/* Primary Action */}
        <Link
          to="/admin/appointments/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95"
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

          {/* Quick Filter Tabs (Visual Only for now) */}
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-lg">
            <button onClick={() => setAppointmentStatus("all")} className={`px-3 py-1.5 ${apopintmentStatus === "all" ? "bg-white text-slate-800 rounded-md shadow-sm " : "text-slate-500 hover:text-slate-700"}  text-sm font-medium transition-colors`}>All</button>
            <button onClick={() => setAppointmentStatus("scheduled")} className={`px-3 py-1.5 ${apopintmentStatus === "scheduled" ? "bg-white text-slate-800 rounded-md shadow-sm " : "text-slate-500 hover:text-slate-700"} text-sm font-medium transition-colors`}>Scheduled</button>
            <button onClick={() => setAppointmentStatus("pending")} className={`px-3 py-1.5 ${apopintmentStatus === "pending" ? "bg-white text-slate-800 rounded-md shadow-sm " : "text-slate-500 hover:text-slate-700"} text-sm font-medium transition-colors`}>Pending</button>
          </div>

          {/* Total Count */}
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Total Scheduled: <strong>{totalItems}</strong></span>
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
              <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                There are no appointments scheduled for the selected range. Click "Book Appointment" to create one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Assuming AppointmentTable handles its own internal layout */}
              <AppointmentTable
                appointments={filtedAppointments}
                itemsToShowAtATime={itemsToShowAtATime}
                totalItems={totalItems}
                itemsRange={itemsRange}
                tableTitle="" // Title handled by header
                viewRole="admin"
                setItemsRange={setItemsRange}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}