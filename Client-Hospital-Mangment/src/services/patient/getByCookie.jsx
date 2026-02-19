import { BACKEND_URL } from "..";

export default async function getByCookie() {
  try {
    const reponse = await fetch(`${BACKEND_URL}/patient/`, {
      method: "GET",
      credentials: "include",
    });
    const reponseData = await reponse.json();
    return { reponseData, error: null };
  } catch (err) {
    return { reponseData: null, error: err };
  }
}
