import LOGO from "/logo.jpg";
import CustomLink from "../../Components/link";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../context/userContext";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  Briefcase,
  Layers,
} from "lucide-react"; // Importing new icons

// --- Helper Components for the New Sections ---

// Stat Card Component
const StatCard = ({ icon: Icon, value, label }) => (
  <div className="p-6 bg-primary rounded-xl shadow-card flex flex-col items-center text-center transition duration-300 hover-lift">
    <div className="w-12 h-12 bg-primary-50/20 text-primary-dark rounded-full flex items-center justify-center mb-3"
      style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-dark)' }}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-3xl font-extrabold text-surface-900 mb-1">{value}</p>
    <p className="text-sm text-surface-600 uppercase tracking-wider">{label}</p>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card-component p-6 hover-lift bg-white rounded-xl text-black">
    <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center"
      style={{ background: 'var(--gradient-primary)' }}>
      <Icon className="w-6 h-6 " />
    </div>
    <h4 className="text-xl font-semibold text-surface-900 mb-2">{title}</h4>
    <p className="text-surface-700 text-sm">{description}</p>
  </div>
);

// --- Main HomePage Component ---

export default function HomePage() {
  const naviagte = useNavigate();
  const { currentRole } = useUserContext();

  useEffect(() => {
    if (currentRole) {
      naviagte(`/${currentRole}`);
      return;
    }
  }, [currentRole, naviagte]);

  // Animation variants remain the same...

  return (
    <div className="min-h-screen bg-surface-50">

      {/* 1. HERO SECTION (Your existing code, slightly restructured) */}
      <main className="min-h-screen flex flex-col md:flex-row bg-primary">

        {/* Marketing Text and CTA Panel */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          <div className="max-w-lg">
            <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
              Welcome to HMS
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight mb-4" style={{ color: 'var(--color-surface-900)' }}>
              Hospital Management System
            </h1>
            <p className="text-lg mb-10" style={{ color: 'var(--color-surface-700)' }}>
              Streamlining administrative tasks and enhancing patient care through a unified digital platform.
            </p>

            {/* CTA Links */}
            <motion.div
              className="flex space-x-4 justify-center"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
              }}
            >
              <CustomLink to="/get-started" text={"Sign Up"} className="btn btn-primary px-8 py-3 text-lg hover-lift" />
              <CustomLink to="/get-started/login" text={"Log In"} className="btn btn-secondary px-8 py-3 text-lg hover-lift" />
            </motion.div>
          </div>
        </motion.div>

        {/* Image/Visual Panel */}
        <div className="md:block md:w-1/2 overflow-hidden flex items-center justify-center p-10"
          style={{ backgroundColor: 'var(--color-primary-50)' }}
        >
          {/* We assume LOGO is a graphic representing the hospital or system */}
          <img
            src={LOGO}
            alt="Hospital Management Illustration"
            className="w-full max-w-md object-contain rounded-full shadow-sm"
          />

        </div>
      </main>

      {/* 2. VALUE PROPOSITION STATS SECTION */}
      <section className="py-16 md:py-24  mx-auto p-6 bg-white">
        <div className="max-w-6xl">
          <h2 className="text-center text-3xl font-bold mb-12" style={{ color: 'var(--color-surface-900)' }}>
            Why Choose Our Digital Platform?
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, staggerChildren: 0.1 }}
          >
            <StatCard icon={Stethoscope} value="45+" label="Expert Doctors" />
            <StatCard icon={Calendar} value="5K+" label="Appointments Booked" />
            <StatCard icon={ShieldCheck} value="100%" label="Data Security" />
            <StatCard icon={Clock} value="24/7" label="Instant Access" />
          </motion.div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="pb-16 md:pb-24 p-12 bg-primary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6" style={{ color: 'var(--color-surface-900)' }}>
            Features Built for You
          </h2>
          <p className="text-center text-lg text-surface-700 max-w-2xl mx-auto mb-12">
            A seamless experience for every role, from scheduling to detailed medical record access.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
          >
            <FeatureCard
              icon={Zap}
              title="Fast Appointment Booking"
              description="Easily find available specialists and book your visit in seconds, with instant confirmation."
            />
            <FeatureCard
              icon={Briefcase}
              title="Personal Health Records"
              description="Secure access to your history, prescriptions, lab results, and patient charts, anytime."
            />
            <FeatureCard
              icon={Layers}
              title="Role-Based Security"
              description="Customized dashboards for Patient, Doctor, and Admin roles, ensuring relevant data access only."
            />
          </motion.div>
        </div>
      </section>

      {/* 4. Simple Footer (Optional but good UX) */}
      <footer className="py-4 text-center text-xs text-surface-500 border-t bg-primary">
        © 2025 Hospital Management System. All rights reserved.
      </footer>
    </div>
  );
}