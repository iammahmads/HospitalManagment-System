import "./App.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signUp";
import GetStartedPage from "./pages/get-started";
import Patient from "./pages/patient";
import NotFound from "./pages/not-found";
import Doctor from "./pages/doctor";
import Admin from "./pages/admin";
import ProtectedRoute from "./Components/protectedRoute";
import ErrorNotifications from "./Components/errorNotidication";
import ResetPassword from "./pages/reset-password";

function App() {

  return (
    <>
      <ErrorNotifications />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="admin-login" element={<LoginPage role="admin" />} />
        <Route path="/get-started">
          <Route path="" element={<GetStartedPage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="reset" element={<ResetPassword />} />
        </Route>

        {/* for child routing */}
        {/* Child routes are present in parent root file i.e index.jsx */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRole={"patient"} component={Patient} />
          }
        />
        <Route
          path="/doctor/*"
          element={<ProtectedRoute allowedRole={"doctor"} component={Doctor} />}
        />
        <Route
          path="/admin/*"
          element={<ProtectedRoute allowedRole={"admin"} component={Admin} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
