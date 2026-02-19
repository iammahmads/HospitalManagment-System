import { BACKEND_URL } from "..";

export default async function getByUser(
  itemsToShowAtATime,
  start,
  user,
  userId
) {
  try {
    const response = await fetch(`${BACKEND_URL}/appointment/byuser`, {
      method: "GET",
      headers: {
        itemstoshowatatime: itemsToShowAtATime,
        start: start,
        user: user,
        userid: userId,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return { responseData, error: null };
  } catch (err) {
    return { responseData: null, error: err };
  }
}
