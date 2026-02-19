import { useEffect, useState } from "react";
import Loader from "../../../Components/loader";
import NotificationTable from "../../../Components/notificationTable";
import getAllNotification from "../../../services/notification/getAllNotification";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  const { addError } = useErrorContext();

  const makePateintNotificationRequest = async () => {
    setIsLoading(true);
    const { repsonseData, error } = await getAllNotification(
      itemsToShowAtATime,
      itemsRange.start
    );
    if (error) {
      addError(error);
      setIsLoading(false);
      return;
    }
    if (!repsonseData.data) {
      addError(repsonseData.message);
      setIsLoading(false);
      return;
    }
    setTotalItems(repsonseData.count);
    setNotifications(repsonseData.data);
    setIsLoading(false);
  };

  useEffect(() => {
    makePateintNotificationRequest();
  }, [itemsRange]);

  return (
    <section className="w-full flex flex-col ">
      <p className="text-textColor font-medium my-2 w-full text-center md:text-lg md:my-4 lg:text-xl lg:my-6">
        Notification(s)
      </p>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-2 ">
          <NotificationTable
            notifications={notifications}
            itemsRange={itemsRange}
            totalItems={totalItems}
            tableTitle={"Notifications"}
            viewRole="patient"
            setItemsRange={setItemsRange}
          />
        </div>
      )}
    </section>
  );
}
