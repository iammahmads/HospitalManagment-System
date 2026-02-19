import { BACKEND_URL } from "..";

export default async function verifyCode(email, codeToVerify, password, role) {
  try {
    const response = await fetch(`${BACKEND_URL}/reset/verify`, {
      method: "POST",
      body: JSON.stringify({ email, codeToVerify, password, role }),
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
