import { BACKEND_URL } from "..";

export default async function createAppointment(appointmentDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/create`, {
      method: "POST",
      body: JSON.stringify(appointmentDetails),
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
