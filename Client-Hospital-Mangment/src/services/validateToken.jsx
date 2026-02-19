import { BACKEND_URL } from ".";

export default async function validateToken(token) {
  try {
    const reponse = await fetch(`${BACKEND_URL}/validateToken`, {
      method: "GET",
      headers: {
        token: token,
      },
    });
    const responseData = await reponse.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
