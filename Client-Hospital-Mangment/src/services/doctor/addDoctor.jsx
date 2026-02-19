import { BACKEND_URL } from "..";

export default async function addDoctor(doctorDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctor/signup`, {
      method: "POST",
      body: JSON.stringify(doctorDetails),
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
