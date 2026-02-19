import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Stethoscope, 
  Clock,
  Activity,
  Users,
  CheckCircle,
  CalendarCheck
} from "lucide-react";

// Components
import Loader from "../../../Components/loader"; 
import AppointmentTable from "../../../Components/appointmentsTable"; 

// Services & Context
import getDoctorUsingCookie from "../../../services/doctor/getDoctorUsingCookie";
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

export default function DoctorHome() {
  const [doctor, setDoctor] = useState({});
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [scheduledLoading, setScheduledLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalScheduled, setTotalScheduled] = useState(0);

  const { addError } = useErrorContext();

  const makeDataRequest = async () => {
    setIsLoading(true);
    const { responseData, error } = await getDoctorUsingCookie();
    if (error) { addError(error); setIsLoading(false); return; }
    if (!responseData.data) { addError(responseData.message); setIsLoading(false); return; }
    setDoctor(responseData.data);
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

  useEffect(() => { makeDataRequest(); }, []);
  useEffect(() => { makeScheduledAppointmentsRequest(); }, [doctor, itemsRange]);

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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 md:p-10 shadow-2xl shadow-blue-900/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium border border-white/10 mb-3">
              <Stethoscope className="w-3 h-3" />
              <span>Doctor Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, Dr. {doctor.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 max-w-xl">
              You have <strong className="text-white">{totalScheduled} upcoming appointments</strong> scheduled. Check your daily agenda below.
            </p>
          </div>
          
          <div className="hidden md:flex gap-8 border-l border-white/10 pl-8">
             <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Today's Schedule</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="font-semibold text-blue-300">Active</span>
                </div>
             </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <Activity className="absolute right-0 bottom-0 w-64 h-64 text-white/5 translate-x-1/3 translate-y-1/3 rotate-12" />
      </motion.div>

      {/* 2. Stats & Quick Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className={`p-6 rounded-2xl border ${doctor.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${doctor.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {doctor.status === 'approved' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Account Status</p>
              <h3 className={`text-2xl font-bold capitalize ${doctor.status === 'approved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {doctor.status}
              </h3>
          </div>

          {/* Patients Count (Static for now or fetch if available) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                      <Users className="w-6 h-6" />
                  </div>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Scheduled</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalScheduled}</h3>
          </div>

          {/* Date Widget */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Today is</p>
              <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-blue-500" />
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
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Upcoming Appointments
                </h2>
                <Link to="/doctor/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
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
                        viewRole="doctor"
                        setItemsRange={setItemsRange}
                    />
                )}
            </div>
        </motion.div>

        {/* RIGHT COLUMN: Profile Summary (1/3 width) */}
        <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-slate-100 border-b border-slate-200" />
                
                <div className="relative z-10 flex flex-col items-center text-center mt-6">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md mb-3">
                        <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Stethoscope className="w-10 h-10" />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{doctor.field}</p>
                    <p className="text-xs text-slate-500 mb-4">{doctor.email}</p>
                    
                    <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-left">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-slate-500">Age</span>
                            <span className="font-medium text-slate-800">{doctor.age}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Gender</span>
                            <span className="font-medium text-slate-800 capitalize">{doctor.gender}</span>
                        </div>
                    </div>

                    <Link 
                        to="/doctor/edit" 
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