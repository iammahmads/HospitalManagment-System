import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Bell, 
  Activity, 
  Droplet, 
  ArrowRight, 
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";

// Components
import Loader from "../../../Components/loader"; 

// Services
import getAdminUsingCookie from "../../../services/admin/getAdminUsingCookie";
import getAllNotification from "../../../services/notification/getAllNotification";
import getAllPatients from "../../../services/patient/getAll";
import getDoctorsByStatus from "../../../services/doctor/getByStatus";
import { BACKEND_URL } from "../../../services"; // Assuming you have this exported

// Helper to fetch custom stats not covered by simple service wrappers
const fetchStats = async () => {
    const API = BACKEND_URL;
    try {
        const [reqs, inv, appts] = await Promise.all([
            fetch(`${API}/requests`, { method: "GET", credentials: "include" }).then(r => r.json()),
            fetch(`${API}/admin/inventory`, { method: "GET", credentials: "include" }).then(r => r.json()),
            fetch(`${API}/appointment/count`, { method: "GET", credentials: "include", headers: { "status": "scheduled" } }).then(r => r.json())
        ]);
        return { 
            bloodRequests: reqs || [], 
            inventory: inv || [],
            scheduledAppointmentsCount: appts?.count || 0 
        };
    } catch (e) {
        console.error("Stats fetch error:", e);
        return { bloodRequests: [], inventory: [], scheduledAppointmentsCount: 0 };
    }
};

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  
  // Dashboard State
  const [admin, setAdmin] = useState({});
  const [stats, setStats] = useState({
    patientsCount: 0,
    doctorsCount: 0,
    pendingDoctorsCount: 0,
    notifications: [],
    bloodRequests: [],
    inventory: [],
    scheduledAppointments: 0
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
        // 1. Admin Profile
        const adminRes = await getAdminUsingCookie();
        if (adminRes?.responseData?.data) setAdmin(adminRes.responseData.data);

        // 2. Parallel Data Fetching for Speed
        const [
            notifsRes, 
            patientsRes, 
            doctorsRes, 
            pendingDocsRes,
            extraStats
        ] = await Promise.all([
            getAllNotification(5, 0), // Recent 5 notifications
            getAllPatients(1, 0),     // Just to get 'count'
            getDoctorsByStatus(1, 0, "approved"), // Approved count
            getDoctorsByStatus(1, 0, "pending"),  // Pending count
            fetchStats() // Custom fetch for blood/appts
        ]);

        setStats({
            notifications: notifsRes?.repsonseData?.data || [],
            patientsCount: patientsRes?.responseData?.count || 0,
            doctorsCount: doctorsRes?.responseData?.count || 0,
            pendingDoctorsCount: pendingDocsRes?.responseData?.count || 0,
            bloodRequests: extraStats.bloodRequests,
            inventory: extraStats.inventory,
            scheduledAppointments: extraStats.scheduledAppointmentsCount
        });

    } catch (error) {
        console.error("Dashboard Load Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  // Calculate critical blood levels (less than 3 units)
  const criticalBlood = stats.inventory.filter(i => i.units < 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Welcome Banner & Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {admin.name?.split(' ')[0] || 'Admin'}</h1>
            <p className="text-slate-400 max-w-lg">
                System is running smoothly. You have <strong className="text-white">{stats.notifications.length} new alerts</strong> and <strong className="text-white">{stats.pendingDoctorsCount} pending approvals</strong> requiring attention.
            </p>
            
            <div className="flex gap-3 mt-6">
                <Link to="/admin/appointments" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Schedule
                </Link>
                <Link to="/admin/blood-managment" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700">
                    <Droplet className="w-4 h-4 text-red-500" /> Blood Bank
                </Link>
            </div>
          </div>

          {/* Live System Status Widget */}
          <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[200px]">
             <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">System Live</span>
             </div>
             <div className="text-2xl font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
             <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </motion.div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Patients" 
            value={stats.patientsCount} 
            icon={Users} 
            color="blue" 
            link="/admin/patients"
          />
          <StatCard 
            title="Active Doctors" 
            value={stats.doctorsCount} 
            subValue={`${stats.pendingDoctorsCount} Pending`}
            icon={Stethoscope} 
            color="emerald" 
            link="/admin/doctors"
            alert={stats.pendingDoctorsCount > 0}
          />
          <StatCard 
            title="Appointments" 
            value={stats.scheduledAppointments} 
            icon={Calendar} 
            color="violet" 
            link="/admin/appointments"
          />
          <StatCard 
            title="Blood Requests" 
            value={stats.bloodRequests.filter(r => r.status === 'pending').length} 
            subValue="Pending Actions"
            icon={Droplet} 
            color="red" 
            link="/admin/blood-managment"
            alert={stats.bloodRequests.filter(r => r.status === 'pending').length > 0}
          />
      </div>

      {/* 3. Main Dashboard Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Activity & Inventory */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Blood Inventory Alerts */}
              {criticalBlood.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                          <h4 className="font-bold text-red-900">Critical Blood Supply Alert</h4>
                          <p className="text-sm text-red-700 mt-1">
                              The following blood groups are running low: 
                              <span className="font-bold ml-1">
                                  {criticalBlood.map(b => b.bloodGroup).join(", ")}
                              </span>
                          </p>
                      </div>
                      <Link to="/admin/blood-managment" className="ml-auto text-sm font-semibold text-red-600 hover:text-red-800">
                          Manage &rarr;
                      </Link>
                  </div>
              )}

              {/* Recent Notifications / Activity Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-500" />
                          Recent Activity
                      </h3>
                      <Link to="/admin/notifications" className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</Link>
                  </div>
                  <div className="divide-y divide-slate-100">
                      {stats.notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">No recent activity found.</div>
                      ) : (
                          stats.notifications.slice(0, 5).map((notif, idx) => (
                              <div key={notif._id || idx} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                      <Bell className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{notif.message}</p>
                                      <p className="text-[10px] text-slate-400 mt-1">
                                          {new Date(notif.dated).toLocaleDateString()} • {new Date(notif.dated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </p>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column: Quick Inventory & Profile */}
          <div className="space-y-8">
              
              {/* Mini Inventory Widget */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-red-500" />
                      Blood Levels
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                      {stats.inventory.map(item => (
                          <div key={item.bloodGroup} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="font-bold text-slate-700">{item.bloodGroup}</span>
                              <span className={`text-sm font-medium ${item.units < 3 ? 'text-red-600' : 'text-slate-600'}`}>
                                  {item.units} <span className="text-[10px] text-slate-400">units</span>
                              </span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Admin Profile Mini */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
                      {admin.name?.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{admin.name}</h3>
                  <p className="text-blue-200 text-sm mb-4">System Administrator</p>
                  <Link to="/admin/edit" className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                      Manage Profile
                  </Link>
              </div>

          </div>
      </div>
    </div>
  );
}

// --- Sub-Component: Stat Card ---
function StatCard({ title, value, subValue, icon: Icon, color, link, alert }) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        red: "bg-red-50 text-red-600",
    };

    return (
        <Link to={link} className="block group">
            <motion.div 
                whileHover={{ y: -2 }}
                className={`bg-white p-5 rounded-2xl shadow-sm border ${alert ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'} h-full transition-all`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {alert && <span className="flex h-3 w-3 bg-red-500 rounded-full animate-pulse" />}
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
                    {subValue && (
                        <p className={`text-xs mt-1 font-medium ${alert ? 'text-red-600' : 'text-slate-400'}`}>
                            {subValue}
                        </p>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}