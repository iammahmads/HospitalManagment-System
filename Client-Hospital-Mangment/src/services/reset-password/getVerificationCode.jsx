import { BACKEND_URL } from "..";

export default async function getVerificationCode(email, role) {
  try {
    const response = await fetch(`${BACKEND_URL}/reset`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
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
