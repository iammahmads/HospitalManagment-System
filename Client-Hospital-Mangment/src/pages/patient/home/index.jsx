import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Edit,
  Clock,
  Activity,
  CalendarCheck,
  MapPin,
  Mail
} from "lucide-react";

// Components
import Loader from "../../../Components/loader";
import AppointmentTable from "../../../Components/appointmentsTable";

// Services & Context
import getByCookie from "../../../services/patient/getByCookie";
import getByStatus from "../../../services/appointment/getByStatus";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PatientHome() {
  const [patient, setPatient] = useState({});
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [scheduledLoading, setScheduledLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalScheduled, setTotalScheduled] = useState(0);

  const { addError } = useErrorContext();

  const makePatientDataRequest = async () => {
    setIsLoading(true);
    const { reponseData, error } = await getByCookie();
    if (error) { addError(error); setIsLoading(false); return; }
    if (!reponseData.data) { addError(reponseData.message); setIsLoading(false); return; }
    setPatient(reponseData.data);
    setIsLoading(false);
  };

  const makeScheduledAppointmentsRequest = async () => {
    setScheduledLoading(true);
    const { reponseData, error } = await getByStatus("scheduled", itemsToShowAtATime, itemsRange.start);
    if (error) { addError(error); setScheduledLoading(false); return; }
    if (!reponseData.data) { addError(reponseData.message); setScheduledLoading(false); return; }

    setTotalScheduled(reponseData.count);
    setScheduledAppointments(reponseData.data);
    setScheduledLoading(false);
  };

  useEffect(() => { makePatientDataRequest(); }, []);
  useEffect(() => { makeScheduledAppointmentsRequest(); }, [patient, itemsRange]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto"
    >

      {/* 1. Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 md:p-10 shadow-2xl shadow-emerald-900/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/10 mb-3">
              <User className="w-3 h-3" />
              <span>Patient Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Hello, {patient.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-emerald-100 max-w-xl">
              Manage your health journey. You have <strong className="text-white">{totalScheduled} upcoming appointments</strong>.
            </p>
          </div>

          {/* Quick Action - Book Appointment */}
           <div className="hidden md:block">
              <Link to="/patient/appointments/new" className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  Book Appointment
              </Link>
           </div>
        </div>

        {/* Background Decor */}
        <Activity className="absolute right-0 bottom-0 w-64 h-64 text-white/5 translate-x-1/3 translate-y-1/3 rotate-12" />
      </motion.div>

      {/* 2. Stats & Quick Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Appointment (Static Placeholder or Logic needed) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Clock className="w-6 h-6" />
                  </div>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Next Visit</p>
              {scheduledAppointments.length > 0 ? (
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                          {new Date(scheduledAppointments[0].dated).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-slate-500">{scheduledAppointments[0].doctorName}</p>
                  </div>
              ) : (
                  <h3 className="text-lg font-bold text-slate-400 mt-1">No upcoming visits</h3>
              )}
          </div>

          {/* Total Scheduled */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <CalendarCheck className="w-6 h-6" />
                  </div>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Scheduled</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalScheduled}</h3>
          </div>

          {/* Date Widget */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Today is</p>
              <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-900">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
              </div>
          </div>
      </motion.div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Schedule (2/3 width) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Upcoming Appointments
                </h2>
                <Link to="/patient/appointments" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
                {scheduledLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader /></div>
                ) : (
                    <AppointmentTable
                        appointments={scheduledAppointments}
                        itemsRange={itemsRange}
                        totalItems={totalScheduled}
                        itemsToShowAtATime={itemsToShowAtATime}
                        tableTitle=""
                        viewRole="patient"
                        setItemsRange={setItemsRange}
                    />
                )}
            </div>
        </motion.div>

        {/* RIGHT COLUMN: Profile Summary (1/3 width) */}
        <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-emerald-50 border-b border-emerald-100" />

                <div className="relative z-10 flex flex-col items-center text-center mt-6">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md mb-3">
                        <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <User className="w-10 h-10" />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3" /> {patient.email}
                    </p>

                    <div className="w-full space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                            <User className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Age / Gender</p>
                                <p className="text-sm font-medium text-slate-800">{patient.age} Years • <span className="capitalize">{patient.gender}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500">Address</p>
                                <p className="text-sm font-medium text-slate-800 line-clamp-1">{patient.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/patient/edit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors text-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>
            </div>
        </motion.div>

      </div>
    </motion.div>
  );
}