// src/pages/get-started/index.jsx

import { Link } from "react-router-dom";
import RoleCards from "./roleCards"; // Import the separate component

// Assume the images are imported here for local use
import DOCTOR_LOGO from "/doctor_uniform.jpg"; 
import PATIENT_LOGO from "/patient_leaving.jpeg"; 

// Data definition remains here, controlling what is passed to the cards
const roleCardDetails = [
  {
    imageSource: PATIENT_LOGO,
    roleText: "patient",
  },
  {
    imageSource: DOCTOR_LOGO,
    roleText: "doctor",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center p-8 bg-surface-50 bg-designColor1/50">
      
      {/* Title Section: Clean, Bold, and Professional */}
      <h2 
        className="text-3xl md:text-4xl font-display font-bold mb-4 md:mb-10 text-center" 
      >
        Choose Your Access Role
      </h2>
      <p className="text-lg text-surface-700 mb-10 text-center max-w-xl">
        Select the option that best describes you to continue to the correct registration portal.
      </p>

      {/* Role Cards Component */}
      <RoleCards roleCardDetails={roleCardDetails} />
      
      {/* Link to Login: Subtle and Clear */}
      <div className="mt-8 text-center text-sm text-surface-600">
        <p>
          Already have an account?{" "}
          <Link
            to={"/get-started/login"}
            className="font-semibold transition duration-150 hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Log In here
          </Link>
        </p>
      </div>

    </main>
  );
}