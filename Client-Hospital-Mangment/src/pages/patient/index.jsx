import { Routes, Route } from "react-router-dom";

// Layout & Components
import PatientMenu from "./menu"; // We will redesign this next
import Home from "./home";
import AllDoctors from "./all-doctors";
import DoctorView from "../../Components/doctorView";
import Appointments from "./appointments";
import NewAppointment from "../new-appointment";
import AppointmentView from "../../Components/appointmentView";
import AllNotifications from "./notifications";
import NotificationView from "../../Components/notificationView";
import BloodDonationRequestForm from "./blood-request";
import EditPateint from "./edit";
import NotFoundPage from "../not-found";

export default function Patient() {
  return (
    // Main Container: Light background, flex layout
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. Sidebar Navigation */}
      {/* PatientMenu handles its own fixed positioning and mobile drawer */}
      <PatientMenu />

      {/* 2. Main Content Wrapper */}
      {/* lg:ml-64 pushes content to the right on desktop to make room for the 16rem sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
        
        {/* Scrollable Content Area with Responsive Padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/">
              {/* Dashboard Home */}
              <Route path="" element={<Home />} />
              
              {/* Edit Profile */}
              <Route path="edit" element={<EditPateint />} />

              {/* Notifications */}
              <Route path="notifications">
                <Route path="" element={<AllNotifications />} />
                <Route 
                  path=":notificationId" 
                  element={<NotificationView viewRole="patient" />} 
                />
              </Route>

              {/* Doctors Directory */}
              <Route path="doctors">
                <Route path="" element={<AllDoctors />} />
                <Route 
                  path=":doctorId" 
                  element={<DoctorView viewRole="patient" />} 
                />
              </Route>

              {/* Appointments */}
              <Route path="appointments">
                <Route path="" element={<Appointments />} />
                <Route path="new" element={<NewAppointment viewRole="patient" />} />
                <Route 
                  path=":appointmentId" 
                  element={<AppointmentView viewRole="patient" />} 
                />
              </Route>

              {/* Blood Donation */}
              <Route path="blood-donation" element={<BloodDonationRequestForm />} />

              {/* 404 / Fallback */}
              <Route 
                path="*" 
                element={<NotFoundPage redirectTo="/patient" />} 
              />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}