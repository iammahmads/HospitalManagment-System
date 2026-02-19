import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSignUp from "../../signUp/adminSignup";

export default function EditAdmin() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 bg-slate-50">
      <div className="w-full max-w-4xl">
        {/* Back Button for better UX */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* The Form Component */}
        <AdminSignUp formMode="edit" />
      </div>
    </main>
  );
}