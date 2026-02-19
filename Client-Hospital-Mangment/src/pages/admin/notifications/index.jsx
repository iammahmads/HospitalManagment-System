import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Filter, Search, CheckCheck } from "lucide-react";

// Components
import Loader from "../../../Components/loader";
import NotificationTable from "../../../Components/notificationTable";

// Services & Context
import useErrorContext from "../../../context/errorContext";
import getAllNotification from "../../../services/notification/getAllNotification";

const itemsToShowAtATime = 10; // Increased default view for notifications

export default function AdminNotifications() {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Pagination State
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  
  const { addError } = useErrorContext();

  // --- Data Fetching ---
  const makeAdminNotificationRequest = async () => {
    setIsLoading(true);
    const { repsonseData, error } = await getAllNotification(
      itemsToShowAtATime,
      itemsRange.start
    );
    if (error) {
      addError(error);
      setIsLoading(false);
      return;
    }
    if (!repsonseData.data) {
      addError(repsonseData.message);
      setIsLoading(false);
      return;
    }
    setTotalItems(repsonseData.count);
    setNotifications(repsonseData.data);
    setIsLoading(false);
  };

  useEffect(() => {
    makeAdminNotificationRequest();
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
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
            </div>
            Notifications Center
          </h1>
          <p className="text-slate-500 mt-1 ml-1">
            Manage system alerts, updates, and messages.
          </p>
        </div>

        {/* Quick Stats or Actions */}
        <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium shadow-sm">
                Total: <strong className="text-slate-900">{totalItems}</strong>
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
        {/* Toolbar (Visual Only for now) */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search notifications..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
                {/* Optional: Mark all read button */}
                <button className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark all read</span>
                </button>
            </div>
        </div>

        {/* Table Content */}
        <div className="p-1">
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader />
                </div>
            ) : notifications.length === 0 ? (
                <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
                    <p className="text-slate-500 mt-1">You have no new notifications.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Wrapped NotificationTable */}
                    <NotificationTable
                        notifications={notifications}
                        itemsRange={itemsRange}
                        totalItems={totalItems}
                        itemsToShowAtATime={itemsToShowAtATime}
                        tableTitle="" // Title is handled by the header now
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