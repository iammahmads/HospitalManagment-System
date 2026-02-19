import { BACKEND_URL } from "..";

export default async function getAllAppointments(itemstoshowatatime, start) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment`, {
      method: "GET",
      headers: {
        itemstoshowatatime,
        start,
      },
      credentials: "include",
    });
    const reponseData = await response.json();
    return { reponseData, error: null };
  } catch (err) {
    return { reponseData: null, error: err };
  }
}
