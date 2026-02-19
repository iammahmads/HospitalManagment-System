import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarX, Clock, Calendar } from "lucide-react";

// Helper function for status styles
const getStatusStyles = (status) => {
  switch (status) {
    case "scheduled":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "cancelled":
    case "deleted":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function AppointmentTable({
  appointments,
  itemsRange = { start: 0, end: 0 },
  totalItems,
  itemsToShowAtATime,
  viewRole = "patient",
  setItemsRange,
}) {
  const navigate = useNavigate();

  const handleAppointmentView = (appointmentId) => {
    const basePath = viewRole === "admin" ? "/admin" : viewRole === "doctor" ? "/doctor" : "/patient";
    navigate(`${basePath}/appointments/${appointmentId}`);
  };

  // --- Pagination Logic ---
  const handlePrevClick = () => {
    if (itemsRange.start - itemsToShowAtATime >= 0) {
      if (itemsRange.start - itemsRange.end === 0) {
        setItemsRange((prev) => ({
          start: prev.start - itemsToShowAtATime,
          end: prev.end - 1,
        }));
      } else {
        setItemsRange((prev) => ({
          start: prev.start - itemsToShowAtATime,
          end: prev.start - 1,
        }));
      }
    }
  };

  const handleNextClick = () => {
    if (itemsRange.end + itemsToShowAtATime <= totalItems) {
      setItemsRange((prev) => ({
        start: prev.start + itemsToShowAtATime,
        end: prev.end + itemsToShowAtATime,
      }));
    } else if (itemsRange.end < totalItems) {
      setItemsRange((prev) => ({
        start: prev.end + 1,
        end: totalItems - 1,
      }));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card Container */}
      <div className="w-[95%] md:w-[90%] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-4">
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            {/* Header */}
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 w-16">#</th>
                <th className="px-6 py-4 font-semibold text-slate-500">
                    {viewRole === 'doctor' ? 'Patient Name' : 'Doctor Name'}
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-center">Time</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <CalendarX className="w-10 h-10 opacity-50" />
                      <p className="text-base font-medium">No Appointments Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => {
                  const tempDate = new Date(appointment.dated);
                  const formattedDate = tempDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  });
                  
                  const displayTime = appointment.hoursTime > 12
                    ? `${appointment.hoursTime % 12}:00 PM`
                    : `${appointment.hoursTime}:00 AM`;

                  return (
                    <tr
                      key={appointment._id || index}
                      onClick={() => handleAppointmentView(appointment._id)}
                      className="bg-white hover:bg-blue-50/50 cursor-pointer transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 font-mono text-slate-400 group-hover:text-blue-500">
                        {itemsRange.start + index + 1}
                      </td>
                      
                      {/* Name */}
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {/* Display appropriate name based on role context */}
                        {viewRole === 'doctor' ? appointment.patientName : appointment.doctorName}
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {displayTime}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-center text-slate-600 font-mono text-xs">
                        <div className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formattedDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wide ${getStatusStyles(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {appointments.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Showing <span className="font-semibold text-slate-900">{itemsRange.start + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(itemsRange.end + 1, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{totalItems}</span> Results
            </span>

            <div className="inline-flex mt-2 xs:mt-0 gap-2">
              <button
                onClick={handlePrevClick}
                disabled={itemsRange.start <= 0}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous</span>
              </button>
              <button
                onClick={handleNextClick}
                disabled={itemsRange.end >= totalItems - 1}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}