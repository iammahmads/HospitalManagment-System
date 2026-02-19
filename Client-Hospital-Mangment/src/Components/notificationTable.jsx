import { useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight, BellOff, Circle } from "lucide-react";

export default function NotificationTable({
  notifications,
  itemsRange = { start: 0, end: 0 },
  totalItems,
  itemsToShowAtATime,
  viewRole = "patient",
  setItemsRange,
}) {
  const navigate = useNavigate();

  const handleNotificationView = (notificationId) => {
    switch (viewRole) {
      case "patient":
        navigate(`/patient/notifications/${notificationId}`);
        break;
      case "doctor":
        navigate(`/doctor/notifications/${notificationId}`);
        break;
      case "admin":
        navigate(`/admin/notifications/${notificationId}`);
        break;
      default:
        break;
    }
  };

  // --- Pagination Logic (Preserved) ---
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
      {/* Card Container */}
      <div className="w-[95%] md:w-[90%] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-4">
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            {/* Header */}
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 w-16">#</th>
                <th className="px-6 py-4 font-semibold text-slate-500">Title / Subject</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <BellOff className="w-10 h-10 opacity-50" />
                      <p className="text-base font-medium">No Notifications</p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((notification, index) => {
                  const notificationViewed =
                    viewRole === "patient"
                      ? notification.viewedBy.patient
                      : viewRole === "doctor"
                      ? notification.viewedBy.doctor
                      : viewRole === "admin"
                      ? notification.viewedBy.admin
                      : false;

                  const tempDate = new Date(notification.dated);
                  const formattedDate = tempDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={notification._id || index}
                      className={`
                        transition-colors duration-150 border-l-4 
                        ${!notificationViewed ? 'bg-blue-50/30 border-blue-500 hover:bg-blue-50' : 'bg-white border-transparent hover:bg-slate-50'}
                      `}
                    >
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {itemsRange.start + index + 1}
                      </td>
                      
                      {/* Notification Title with Indicator */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            {!notificationViewed && (
                                <Circle className="w-2.5 h-2.5 fill-blue-500 text-blue-500 shrink-0" />
                            )}
                            <span className={`font-medium ${!notificationViewed ? 'text-slate-900' : 'text-slate-600'}`}>
                                {notification.title}
                            </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-center font-mono text-xs text-slate-500">
                        {formattedDate}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleNotificationView(notification._id)}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                            ${!notificationViewed 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'}
                          `}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden md:inline">{!notificationViewed ? "Read" : "View"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {notifications.length > 0 && (
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