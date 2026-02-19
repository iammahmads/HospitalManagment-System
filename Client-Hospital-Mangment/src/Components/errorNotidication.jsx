import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import useErrorContext from "../context/errorContext";

export default function ErrorNotifications() {
  const errorContext = useErrorContext();

  return (
    // Container: Fixed to top-right on desktop, top-center on mobile
    <div className="fixed top-4 right-0 left-0 md:left-auto md:right-4 z-[9999] flex flex-col items-center md:items-end gap-3 p-4 pointer-events-none">
      <AnimatePresence>
        {errorContext.errorList.map((error, index) => (
          <Notification key={index} error={error} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } },
};

function Notification({ error }) {
  const errorContext = useErrorContext();
  const [isPaused, setIsPaused] = useState(false);

  const removeError = () => {
    errorContext.setErrorsList((prev) =>
      prev.filter((errorItem) => errorItem !== error)
    );
  };

  // Determine styles and icon based on variant
  const getVariantStyles = () => {
    switch (error.variant) {
      case "danger": // Error
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          borderColor: "border-red-500",
          progressColor: "bg-red-500",
          bgColor: "bg-white",
          title: "Error",
        };
      case "success": // Success
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          borderColor: "border-green-500",
          progressColor: "bg-green-500",
          bgColor: "bg-white",
          title: "Success",
        };
      case "warning": // Warning
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          borderColor: "border-amber-500",
          progressColor: "bg-amber-500",
          bgColor: "bg-white",
          title: "Warning",
        };
      default: // Info/Default
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          borderColor: "border-blue-500",
          progressColor: "bg-blue-500",
          bgColor: "bg-white",
          title: "Notification",
        };
    }
  };

  const styles = getVariantStyles();

  // Auto-dismiss logic with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      removeError();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPaused]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 ${styles.borderColor} border-l-4`}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 pt-0.5">{styles.icon}</div>

        {/* Content */}
        <div className="flex-1 pt-0.5">
          <h3 className="font-semibold text-sm text-gray-900 leading-none mb-1">
            {styles.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {error.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={removeError}
          className="shrink-0 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar (Visual Timer) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <motion.div
          className={`h-full ${styles.progressColor}`}
          initial={{ width: "100%" }}
          animate={{ width: isPaused ? "100%" : "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}