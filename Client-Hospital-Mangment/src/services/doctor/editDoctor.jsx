import { BACKEND_URL } from "..";

export default async function editDoctor(doctorDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctor`, {
      method: "PATCH",
      body: JSON.stringify(doctorDetails),
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
