import { BACKEND_URL } from "..";

export default async function getAllPatients(itemsToShowAtATime, start) {
  try {
    const response = await fetch(`${BACKEND_URL}/patient/all`, {
      method: "GET",
      headers: {
        start: start,
        itemstoshowatatime: itemsToShowAtATime,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
