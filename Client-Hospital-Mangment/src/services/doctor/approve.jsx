import { BACKEND_URL } from "..";

export default async function approveDoctorById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctor/approve`, {
      method: "PATCH",
      headers: {
        doctorid: id,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
