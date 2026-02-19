import { Route, Routes } from "react-router-dom";

// Page Imports
import Home from "./home";
import DoctorMenu from "./menu"; // We'll redesign this next to match AdminMenu
import DoctorNotifications from "./notifications";
import NotificationView from "../../Components/notificationView";
import MyPatients from "./patients";
import PatientView from "../../Components/patientView";
import Appointments from "./appointments";
import AppointmentView from "../../Components/appointmentView";
import EditDoctor from "./edit";
import NotFoundPage from "../not-found";

export default function Doctor() {
  return (
    // Main Container: Light background, flex layout
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. Sidebar Navigation */}
      {/* DoctorMenu handles its own fixed positioning and mobile drawer */}
      <DoctorMenu />

      {/* 2. Main Content Wrapper */}
      {/* lg:ml-64 pushes content to the right on desktop to make room for the 16rem sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
        
        {/* Scrollable Content Area with Responsive Padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/">
              {/* Dashboard Home */}
              <Route path="" element={<Home />} />
              
              {/* Profile Edit */}
              <Route path="edit" element={<EditDoctor />} />

              {/* Notifications Section */}
              <Route path="notifications">
                <Route path="" element={<DoctorNotifications />} />
                <Route 
                  path=":notificationId" 
                  element={<NotificationView viewRole="doctor" />} 
                />
              </Route>

              {/* Patients Section */}
              <Route path="patients">
                <Route path="" element={<MyPatients />} />
                <Route path=":patientId" element={<PatientView viewRole="doctor" />} />
              </Route>

              {/* Appointments Section */}
              <Route path="appointments">
                <Route path="" element={<Appointments />} />
                <Route 
                  path=":appointmentId" 
                  element={<AppointmentView viewRole="doctor" />} 
                />
              </Route>

              {/* 404 / Fallback */}
              <Route 
                path="*" 
                element={<NotFoundPage redirectTo="/doctor" />} 
              />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}