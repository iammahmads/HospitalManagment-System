import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, UserPlus } from "lucide-react";

// Components
import PatientsTable from "../../../Components/patientsTable";
import Loader from "../../../Components/loader";

// Services & Context
import getAllPatients from "../../../services/patient/getAll";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);

  const { addError } = useErrorContext();

  const fetchPatients = async () => {
    setIsLoading(true);
    const { responseData, error } = await getAllPatients(
      itemsToShowAtATime,
      itemsRange.start
    );
    
    if (error) {
      addError(error);
      setIsLoading(false);
      return;
    }
    if (!responseData.data) {
      addError(responseData.message);
      setIsLoading(false);
      return;
    }
    
    setPatients(responseData.data);
    setTotalItems(responseData.count);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPatients();
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
            <Users className="w-8 h-8 text-blue-600" />
            My Patients
          </h1>
          <p className="text-slate-500 mt-1">
            View records of patients under your care.
          </p>
        </div>
        
        {/* Quick Stat */}
        <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium shadow-sm">
                Total Patients: <strong className="text-slate-900">{totalItems}</strong>
            </span>
        </div>
      </motion.div>

      {/* 2. Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search patients..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-1">
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader />
                </div>
            ) : patients.length === 0 ? (
                <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No patients found</h3>
                    <p className="text-slate-500 mt-1">You don't have any patients assigned yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <PatientsTable
                        patients={patients}
                        itemsToShowAtATime={itemsToShowAtATime}
                        totalItems={totalItems}
                        itemsRange={itemsRange}
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