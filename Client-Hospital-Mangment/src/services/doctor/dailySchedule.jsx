import { BACKEND_URL } from "..";

export default async function dailyDoctorSchedule(doctorId, time) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctor/dailySchedule`, {
      method: "GET",
      headers: {
        doctorid: doctorId,
        time,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
