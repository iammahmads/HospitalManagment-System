import { BACKEND_URL } from "..";

export default async function deleteAppointmentById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
