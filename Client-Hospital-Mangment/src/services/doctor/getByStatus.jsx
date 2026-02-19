import { BACKEND_URL } from "..";

export default async function getDoctorsByStatus(
  itemsToShowAtATime,
  start,
  status
) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctor/status`, {
      method: "GET",
      headers: {
        itemstoshowatatime: itemsToShowAtATime,
        start: start,
        status: status,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
