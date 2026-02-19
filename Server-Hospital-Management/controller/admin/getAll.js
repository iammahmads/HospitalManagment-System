import { AdminModel } from "../../models/admin.js";

const getAllAdmins = async (req, res) => {
  const { role } = req;
  const { itemstoshowatatime, start } = req.headers;
  let data = null;

  //   vrifying role
  if (!role) {
    return res.json({ message: "no role found" });
  }
  if (!(itemstoshowatatime && start)) {
    return res.json({
      message: "please specify start and itemstoshowatatime in header",
    });
  }

  try {
    data = await AdminModel.find().skip(start).limit(itemstoshowatatime);
    if (!data || data.length == 0) {
      return res.json({ message: "no admin found", data: null });
    }

    return res.json({ message: "admin found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting admin: " + err,
      data: data,
    });
  }
};

export default getAllAdmins;
