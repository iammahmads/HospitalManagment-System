import { BACKEND_URL } from "..";

export default async function editPatient(patientDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/patient`, {
      method: "PATCH",
      body: JSON.stringify(patientDetails),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
