import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, FileText, UserPlus } from "lucide-react";

// Components
import PatientsTable from "../../../Components/patientsTable";
import Loader from "../../../Components/loader";

// Services & Context
import getAllPatients from "../../../services/patient/getAll";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  
  // Search State (Optional - for UI demo, needs backend implementation to work fully)
  const [searchTerm, setSearchTerm] = useState("");

  const { addError } = useErrorContext();

  const makePatientsDataRequest = async () => {
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
    makePatientsDataRequest();
  }, [itemsRange]);

  // Filter patients locally for immediate feedback (if you have all data, otherwise rely on backend)
  // For pagination, usually filtering happens on backend. This is just visual.
  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Patient Management
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage registered patient records.
          </p>
        </div>
        
        {/* Quick Stats or Actions */}
        <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded-md">
                    <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase">Total Patients</p>
                    <p className="text-lg font-bold text-slate-900 leading-none">{totalItems}</p>
                </div>
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
        {/* Toolbar / Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search patients by name or email..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Optional: Add Patient Button (If Admin can add manually) */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <UserPlus className="w-4 h-4" />
                Add Patient
            </button> 
            */}
        </div>

        {/* Table Content */}
        <div className="p-1">
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader />
                </div>
            ) : filteredPatients.length === 0 && !isLoading ? (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No patients found</h3>
                    <p className="text-slate-500">Try adjusting your search or add a new patient.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Assuming PatientsTable is responsive or handles horizontal scroll */}
                    <PatientsTable
                        patients={searchTerm ? filteredPatients : patients}
                        itemsToShowAtATime={itemsToShowAtATime}
                        totalItems={totalItems}
                        itemsRange={itemsRange}
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