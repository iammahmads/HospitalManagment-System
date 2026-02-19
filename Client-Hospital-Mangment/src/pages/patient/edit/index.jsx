import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientSignUp from "../../signUp/patientSignup";

export default function EditPateint() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 bg-slate-50">
      <div className="w-full max-w-3xl">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Form Container */}
        {/* The PatientSignUp component handles its own internal card styling */}
        <PatientSignUp formMode="edit" />
      </div>
    </main>
  );
}