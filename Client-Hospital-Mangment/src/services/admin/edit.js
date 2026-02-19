import { BACKEND_URL } from "../index"; 

export default async function editAdmin(details) {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Critical for updating protected profile
      body: JSON.stringify(details),
    });
    const responseData = await res.json();
    return { responseData, error: null };
  } catch (error) {
    return { responseData: null, error: error.message };
  }
}