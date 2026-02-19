import { Route, Routes, Navigate } from "react-router-dom";

// Page Imports
import Home from "./home";
import AdminMenu from "./menu";
import AdminNotifications from "./notifications";
import NotificationView from "../../Components/notificationView";
import Patients from "./patients";
import PatientView from "../../Components/patientView";
import Doctors from "./doctor";
import DoctorView from "../../Components/doctorView";
import Appointments from "./appointments";
import AppointmentView from "../../Components/appointmentView";
import NewAppointment from "../new-appointment";
import EditAdmin from "./edit";
import AdminBloodRequstsPage from "./blood-requests";
import NotFoundPage from "../not-found";

export default function Admin() {
  return (
    // Main Wrapper: Light background for the whole dashboard
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. Sidebar Navigation */}
      {/* AdminMenu is 'fixed' inside its own component, so we just render it here. */}
      {/* It will overlay on mobile and stick to the left on desktop. */}
      <AdminMenu />

      {/* 2. Main Content Area */}
      {/* lg:ml-64 pushes content right on desktop to accommodate the 16rem (64) sidebar */}
      {/* min-h-screen ensures the background color fills the full height */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
        
        {/* Responsive Padding Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/">
              {/* Dashboard Home */}
              <Route path="" element={<Home />} />
              
              {/* Profile Edit */}
              <Route path="edit" element={<EditAdmin />} />

              {/* Notifications */}
              <Route path="notifications">
                <Route path="" element={<AdminNotifications />} />
                <Route path=":notificationId" element={<NotificationView viewRole="admin" />} />
              </Route>

              {/* Patients */}
              <Route path="patients">
                <Route path="" element={<Patients />} />
                <Route path=":patientId" element={<PatientView viewRole="admin" />} />
              </Route>

              {/* Doctors */}
              <Route path="doctors">
                <Route path="" element={<Doctors />} />
                <Route path=":doctorId" element={<DoctorView viewRole="admin" />} />
              </Route>

              {/* Appointments */}
              <Route path="appointments">
                <Route path="" element={<Appointments />} />
                <Route path="new" element={<NewAppointment viewRole="admin" />} />
                <Route path=":appointmentId" element={<AppointmentView viewRole="admin" />} />
              </Route>

              {/* Blood Bank */}
              <Route path="blood-managment" element={<AdminBloodRequstsPage />} />

              {/* 404 & Redirects */}
              <Route path="*" element={<NotFoundPage redirectTo="/admin" />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}