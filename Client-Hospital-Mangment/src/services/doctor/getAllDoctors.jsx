import { BACKEND_URL } from "..";

export default async function getAllDcotors(itemstoshowatatime, start) {
  try {
    const reponse = await fetch(`${BACKEND_URL}/doctor/all`, {
      method: "GET",
      headers: {
        itemstoshowatatime,
        start,
      },
      credentials: "include",
    });
    const repsonseData = await reponse.json();
    return { repsonseData, error: null };
  } catch (err) {
    return { repsonseData: null, error: err };
  }
}
