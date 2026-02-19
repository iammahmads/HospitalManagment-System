// src/pages/get-started/roleCards.jsx

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For entry animation

// --- Helper RoleCard Component ---

function RoleCard({ imageSource, roleText }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to signup, passing the role in state
    navigate("/get-started/signup", { state: { userRole: roleText } });
  };

  return (
    // Card Container: Uses card-component, hover-lift, and group for advanced hover effects
    <div
      onClick={handleClick}
      className="card-component cursor-pointer hover-lift flex flex-col overflow-hidden group active:scale-[0.98] transition-transform duration-200"
    >
      {/* Image Section: Visually engaging photo with subtle hover scale */}
      <div className="overflow-hidden h-48 sm:h-52 md:h-60">
        <img
          src={imageSource}
          alt={`${roleText} illustration`}
          className="w-full h-full object-cover object-top transition duration-500 ease-in-out group-hover:scale-[1.05] opacity-95 group-hover:opacity-100"
        />
      </div>
      
      {/* Footer Text: Clear role designation with brand color accent */}
      <div className="py-5 bg-white border-t border-surface-100 flex justify-center">
        <p 
            className="text-xl md:text-2xl font-bold capitalize tracking-wider"
            style={{ color: 'var(--color-primary-dark)' }} 
        >
          I am a {roleText}
        </p>
      </div>
    </div>
  );
}


// --- Main RoleCards Component ---

export default function RoleCards({ roleCardDetails }) {
  return (
    // Container for the cards - responsive flex layout for up to 3 roles
    <motion.div 
        className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-6 p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {roleCardDetails.map((detail, index) => (
        <motion.div 
            key={index} 
            // Ensures cards take equal width on desktop
            className="w-full md:flex-1 md:max-w-xs" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
        >
          <RoleCard
            roleText={detail.roleText}
            imageSource={detail.imageSource}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}