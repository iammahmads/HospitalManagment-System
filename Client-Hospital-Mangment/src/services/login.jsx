import { BACKEND_URL } from ".";

export default async function login(loginDetails) {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      body: JSON.stringify(loginDetails),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
