import { BACKEND_URL } from "..";

export default async function getAllNotification(
  itemstoshowatatime,
  start,
  viewedbyadmin = false
) {
  try {
    const response = await fetch(`${BACKEND_URL}/notification`, {
      method: "GET",
      headers: {
        itemstoshowatatime,
        start,
        viewedbyadmin,
      },
      credentials: "include",
    });
    const repsonseData = await response.json();
    return { repsonseData, error: null };
  } catch (err) {
    return { repsonseData: null, error: err };
  }
}
