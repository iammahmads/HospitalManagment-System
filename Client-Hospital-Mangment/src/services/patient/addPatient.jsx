import { BACKEND_URL } from "..";

export default async function addPatient(patientDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/patient/signup`, {
      method: "POST",
      body: JSON.stringify(patientDetails),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
