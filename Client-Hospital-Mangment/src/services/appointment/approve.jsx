import { BACKEND_URL } from "..";

export default async function approveAppointmentById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/approve`, {
      method: "PATCH",
      headers: {
        appointmentid: id,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
