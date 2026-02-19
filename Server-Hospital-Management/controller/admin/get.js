import { AdminModel } from "../../models/admin.js";
import { verifyToken } from "../../utils/authentication/jwt.js";

const getAdminByCookie = async (req, res) => {
  const { token } = req.cookies;
  let data = null;
  if (!token) {
    return res.json({ message: "no token cookie found", data: null });
  }
  const payLoad = verifyToken(token);
  if (!payLoad) {
    return res.json({ message: "invalid or expired token", data: null });
  }

  const adminId = payLoad.id;
  try {
    data = await AdminModel.findById(adminId);

    // verifying data
    if (!data) {
      return res.json({ message: "invalid admin id", data: null });
    }

    // sending only necessary details
    const tempData = {
      id: data._id,
      name: data.name,
      cnic: data.cnic,
      age: data.age,
      gender: data.gender,
      email: data.email,
    };

    data = tempData;

    return res.json({ message: "data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting data using cookie: " + err,
      data: null,
    });
  }
};

export default getAdminByCookie;
