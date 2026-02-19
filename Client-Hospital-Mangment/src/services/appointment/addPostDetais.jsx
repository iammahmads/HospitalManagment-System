import { BACKEND_URL } from "..";

export default async function addPostDetails(postDetails, id) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/addpostdetails`, {
      method: "PATCH",
      body: JSON.stringify({ appointmentId: id, post: postDetails }),
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
