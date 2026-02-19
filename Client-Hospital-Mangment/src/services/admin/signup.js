import { BACKEND_URL } from "../index"; // Ensure this path points to where BACKEND_URL is defined

export default async function addAdmin(details) {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    const responseData = await res.json();
    return { responseData, error: null };
  } catch (error) {
    return { responseData: null, error: error.message };
  }
}