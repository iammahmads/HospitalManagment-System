import { BACKEND_URL } from "..";

export default async function getNotificationById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/notification/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
