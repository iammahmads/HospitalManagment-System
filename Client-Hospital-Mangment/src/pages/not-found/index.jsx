import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, FileQuestion, Activity } from "lucide-react";

export default function NotFoundPage({ redirectTo = "/" }) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <Activity className="absolute top-10 left-10 w-64 h-64 text-slate-200/50 -rotate-12" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Animated Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white p-6 rounded-full shadow-xl border border-slate-100 flex items-center justify-center h-full w-full">
             <FileQuestion className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Typography */}
        <h1 className="text-8xl font-black text-slate-900 mb-2 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
          Oops! It looks like you've taken a wrong turn. The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <button
            onClick={handleHomeClick}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </main>
  );
}