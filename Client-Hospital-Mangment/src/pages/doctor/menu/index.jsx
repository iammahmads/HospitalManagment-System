import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  CalendarCheck, 
  LogOut, 
  Menu, 
  X,
  Stethoscope
} from "lucide-react";

import useUserContext from "../../../context/userContext";

// Define menu items with Icons
const doctorMenuDetails = [
  { 
    text: "Dashboard", 
    path: "/doctor", 
    icon: LayoutDashboard 
  },
  { 
    text: "My Patients", 
    path: "/doctor/patients", 
    icon: Users 
  },
  { 
    text: "Appointments", 
    path: "/doctor/appointments", 
    icon: CalendarCheck 
  },
  { 
    text: "Notifications", 
    path: "/doctor/notifications", 
    icon: Bell 
  },
];

export default function DoctorMenu() {
  const { handleLogout } = useUserContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Helper to determine if a link is active
  const isActive = (path) => {
    if (path === "/doctor" && location.pathname === "/doctor") return true;
    if (path !== "/doctor" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Reusable Content Component
  const MenuContent = () => (
    <div className="flex flex-col h-full text-slate-300">
      {/* Header / Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="p-1.5 bg-blue-600 rounded-lg">
          {/* Using an Icon instead of specific image for reliability, 
              or replace Stethoscope with your <img src="/nobackground_logo.png" ... /> */}
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-wide">
          DoctorPanel
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {doctorMenuDetails.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />
              {item.text}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors rounded-lg hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Top Bar (Visible only on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-md">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Doctor Portal</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-300 rounded-md hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 2. Desktop Sidebar (Fixed, visible only on LG screens) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 shadow-xl">
        <MenuContent />
      </aside>

      {/* 3. Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-64 bg-slate-900 shadow-2xl border-r border-slate-800 lg:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <MenuContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}