import { useEffect, useState } from "react";
import Loader from "../../../Components/loader";
import DoctorTable from "../../../Components/doctorTable";
import getAllDcotors from "../../../services/doctor/getAllDoctors";
import useErrorContext from "../../../context/errorContext";

const itemsToShowAtATime = 5;

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [itemsRange, setItemsRange] = useState({
    start: 0,
    end: itemsToShowAtATime - 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  const { addError } = useErrorContext();

  const makeApprovedDoctorsDataRequest = async () => {
    setDoctorsLoading(true);
    const { repsonseData, error } = await getAllDcotors(
      itemsToShowAtATime,
      itemsRange.start
    );
    if (error) {
      addError(error);
      setDoctorsLoading(false);
      return;
    }
    if (!repsonseData.data) {
      addError(repsonseData.message);
      setDoctorsLoading(false);
      return;
    }
    setTotalItems(repsonseData.count);
    setDoctors(repsonseData.data);
    setDoctorsLoading(false);
  };

  useEffect(() => {
    makeApprovedDoctorsDataRequest();
  }, [itemsRange]);
  return (
    <section className="w-full flex flex-col ">
      <>
        <div className="w-full flex justify-center space-x-1 my-2  md:my-4 lg:my-6">
          <p className="text-textColor font-medium  md:text-lg lg:text-xl ">
            Approved Doctor(s)
          </p>
        </div>

        <div className="px-2 ">
          {doctorsLoading ? (
            <Loader />
          ) : (
            <div className="px-2 ">
              <DoctorTable
                doctors={doctors}
                tableTitle={"Notifications"}
                itemsRange={itemsRange}
                itemsToShowAtATime={itemsToShowAtATime}
                totalItems={totalItems}
                setItemsRange={setItemsRange}
                viewRole="patient"
              />
            </div>
          )}
        </div>
      </>
    </section>
  );
}
