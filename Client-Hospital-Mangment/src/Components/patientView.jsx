import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  History, 
  FileText 
} from "lucide-react";

// Components
import Loader from "./loader";
import AppointmentTable from "./appointmentsTable";
import NotFoundPage from "../pages/not-found";

// Services & Context
import getPatientById from "../services/patient/getById";
import getByUser from "../services/appointment/getByUser";
import useErrorContext from "../context/errorContext";

const itemsToShowAtATime = 5;

export default function PatientView({ viewRole = "doctor" }) {
  const { patientId } = useParams();
  const { addError } = useErrorContext();

  // State
  const [patient, setPatient] = useState({});
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientFound, setPatientFound] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  
  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);

  // --- Fetch Patient Data ---
  const makePatientDataRequest = async () => {
    setPatientLoading(true);
    const { responseData, error } = await getPatientById(patientId);
    
    if (error || !responseData.data) {
      addError(error || responseData.message);
      setPatientLoading(false);
      setPatientFound(false);
      return;
    }
    
    setPatient(responseData.data);
    setPatientLoading(false);
    setPatientFound(true);
  };

  // --- Fetch Appointment History ---
  const makeAppointmentsDataRequest = async () => {
    setAppointmentsLoading(true);
    const { responseData, error } = await getByUser(
      itemsToShowAtATime,
      itemsRange.start,
      "patient",
      patientId
    );

    if (error || !responseData.data) {
      addError(error || responseData.message);
      setAppointmentsLoading(false);
      return;
    }

    setTotalItems(responseData.count);
    setAppointments(responseData.data);
    setAppointmentsLoading(false);
  };

  useEffect(() => {
    makePatientDataRequest();
  }, []); // Run once on mount

  useEffect(() => {
    if (patientFound) {
      makeAppointmentsDataRequest();
    }
  }, [patientFound, itemsRange]); // Re-fetch appointments if page changes

  // --- 404 Handling ---
  if (!patientFound && !patientLoading) {
    const redirectPath = viewRole === "admin" ? "/admin" : viewRole === "doctor" ? "/doctor" : "/patient";
    return <NotFoundPage redirectTo={redirectPath} />;
  }

  if (patientLoading) {
      return (
          <div className="h-screen flex justify-center items-center">
              <Loader />
          </div>
      );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* 1. Header & Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Patient Medical Profile
            </h1>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-sm">
                    <User className="w-12 h-12" />
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    Patient
                </span>
            </div>

            {/* Details Section */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                    <p className="text-lg font-medium text-slate-900">{patient.name}</p>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                    <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p>{patient.email}</p>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Gender</label>
                    <p className="capitalize text-slate-700">{patient.gender}</p>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Age</label>
                    <p className="text-slate-700">{patient.age} Years Old</p>
                </div>
            </div>
        </div>
      </motion.div>

      {/* 2. Appointment History Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 px-1">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-800">Appointment History</h2>
        </div>

        {appointmentsLoading ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 flex justify-center">
                <Loader />
            </div>
        ) : appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-medium">No appointments found</h3>
                <p className="text-slate-500 text-sm mt-1">This patient has no recorded appointment history.</p>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <AppointmentTable
                    appointments={appointments}
                    itemsRange={itemsRange}
                    totalItems={totalItems}
                    itemsToShowAtATime={itemsToShowAtATime}
                    tableTitle="" // Handled by header above
                    setItemsRange={setItemsRange}
                    viewRole={viewRole}
                />
            </div>
        )}
      </motion.div>
    </div>
  );
}