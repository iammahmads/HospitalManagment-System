import { BACKEND_URL } from "..";

export default async function createNotification(notificationDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/notification`, {
      method: "POST",
      body: JSON.stringify(notificationDetails),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
