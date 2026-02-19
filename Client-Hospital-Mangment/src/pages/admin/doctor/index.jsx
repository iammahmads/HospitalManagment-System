import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, CheckCircle, Clock, UserCheck, AlertCircle } from "lucide-react";

// Components
import Loader from "../../../Components/loader";
import DoctorTable from "../../../Components/doctorTable"; // Assuming this is compatible or will be updated

// Services & Context
import getDoctorsByStatus from "../../../services/doctor/getByStatus";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function Doctors() {
  const { addError } = useErrorContext();
  
  // Tab State: 'approved' | 'pending'
  const [activeTab, setActiveTab] = useState("approved");

  // --- Approved Doctors State ---
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [approvedDoctorsLoading, setApprovedDoctorsLoading] = useState(true);
  const [approvedRange, setApprovedRange] = useState({ start: 0, end: itemsToShowAtATime - 1 });
  const [approvedTotal, setApprovedTotal] = useState(0);

  // --- Pending Doctors State ---
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingDoctorsLoading, setPendingDoctorsLoading] = useState(true);
  const [pendingRange, setPendingRange] = useState({ start: 0, end: itemsToShowAtATime - 1 });
  const [pendingTotal, setPendingTotal] = useState(0);

  // --- Data Fetching ---
  const makeApprovedDoctorsRequest = async () => {
    setApprovedDoctorsLoading(true);
    const { responseData, error } = await getDoctorsByStatus(itemsToShowAtATime, approvedRange.start, "approved");
    if (error) { addError(error); setApprovedDoctorsLoading(false); return; }
    if (!responseData.data) { addError(responseData.message); setApprovedDoctorsLoading(false); return; }
    
    setApprovedTotal(responseData.count);
    setApprovedDoctors(responseData.data);
    setApprovedDoctorsLoading(false);
  };

  const makePendingDoctorsRequest = async () => {
    setPendingDoctorsLoading(true);
    const { responseData, error } = await getDoctorsByStatus(itemsToShowAtATime, approvedRange.start, "pending");
    if (error) { addError(error); setPendingDoctorsLoading(false); return; }
    if (!responseData.data) { addError(responseData.message); setPendingDoctorsLoading(false); return; }
    
    setPendingTotal(responseData.count);
    setPendingDoctors(responseData.data);
    setPendingDoctorsLoading(false);
  };

  useEffect(() => { makeApprovedDoctorsRequest(); }, [approvedRange]);
  useEffect(() => { makePendingDoctorsRequest(); }, [pendingRange]);

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
            <Stethoscope className="w-8 h-8 text-blue-600" />
            Doctor Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage doctor profiles, approvals, and verify credentials.
          </p>
        </div>
      </motion.div>

      {/* 2. Stats & Tabs Container */}
      <div className="flex flex-col gap-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveTab("approved")}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${activeTab === 'approved' ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300'}`}
              >
                  <div className={`p-3 rounded-lg ${activeTab === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-sm font-medium text-slate-500">Approved Doctors</p>
                      <h3 className="text-2xl font-bold text-slate-900">{approvedTotal}</h3>
                  </div>
              </div>

              <div 
                onClick={() => setActiveTab("pending")}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${activeTab === 'pending' ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-100' : 'bg-white border-slate-200 hover:border-amber-300'}`}
              >
                  <div className={`p-3 rounded-lg ${activeTab === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Clock className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                      <h3 className="text-2xl font-bold text-slate-900">{pendingTotal}</h3>
                  </div>
              </div>
          </div>

          {/* 3. Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
              
              {/* Tab Header (Visual) */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
                  {activeTab === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                  ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <h2 className="text-lg font-semibold text-slate-800 capitalize">
                      {activeTab} Doctors Directory
                  </h2>
              </div>

              {/* Dynamic Content */}
              <div className="p-1">
                  <AnimatePresence mode="wait">
                      {activeTab === "approved" ? (
                          <motion.div
                              key="approved"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                          >
                              {approvedDoctorsLoading ? (
                                  <div className="py-20 flex justify-center"><Loader /></div>
                              ) : (
                                  <DoctorTable
                                      doctors={approvedDoctors}
                                      tableTitle="" // Hidden to avoid redundancy
                                      itemsRange={approvedRange}
                                      itemsToShowAtATime={itemsToShowAtATime}
                                      totalItems={approvedTotal}
                                      setItemsRange={setApprovedRange}
                                      viewRole="admin"
                                  />
                              )}
                          </motion.div>
                      ) : (
                          <motion.div
                              key="pending"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                          >
                              {pendingDoctorsLoading ? (
                                  <div className="py-20 flex justify-center"><Loader /></div>
                              ) : (
                                  <DoctorTable
                                      doctors={pendingDoctors}
                                      tableTitle=""
                                      itemsRange={pendingRange}
                                      itemsToShowAtATime={itemsToShowAtATime}
                                      totalItems={pendingTotal}
                                      setItemsRange={setPendingRange}
                                      viewRole="admin"
                                  />
                              )}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          </div>
      </div>
    </div>
  );
}