import { BACKEND_URL } from "..";

export default async function getByStatus(status, itemstoshowatatime, start) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/bystatus`, {
      method: "GET",
      headers: {
        status,
        itemstoshowatatime,
        start,
      },
      credentials: "include"
    });
    const reponseData = await response.json();
    return { reponseData, error: null };
  } catch (err) {
    return { reponseData: null, error: err };
  }
}
