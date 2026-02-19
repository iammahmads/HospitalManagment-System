import { useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight, UserX } from "lucide-react";

export default function PatientsTable({
  patients,
  itemsRange = { start: 0, end: 0 },
  totalItems,
  itemsToShowAtATime,
  viewRole = "doctor",
  setItemsRange,
}) {
  const navigate = useNavigate();

  const handlePatientView = (patientId) => {
    const basePath = viewRole === "admin" ? "/admin/patients" : "/doctor/patients";
    navigate(`${basePath}/${patientId}`);
  };

  // Kept original pagination logic intact
  const handlePrevClick = () => {
    if (itemsRange.start - itemsToShowAtATime >= 0) {
      if (itemsRange.start - itemsRange.end === 0) {
        setItemsRange((prev) => ({
          start: prev.start - itemsToShowAtATime,
          end: prev.end - 1,
        }));
      } else if (itemsRange.end - itemsRange.start > 0) {
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
      {/* Modern Card Container for Table */}
      <div className="w-[95%] md:w-[90%] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            {/* Modern Header */}
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500">#</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Patient</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-center">CNIC</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {patients.length <= 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <UserX className="w-10 h-10 opacity-50" />
                      <p className="text-base font-medium">No Patients Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr
                    key={patient._id || index}
                    className="bg-white hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {itemsRange.start + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-600">
                      {patient.cnic || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Modern Icon Button instead of generic Button */}
                      <button
                        onClick={() => handlePatientView(patient._id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modern Pagination Footer */}
        {patients.length > 0 && (
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