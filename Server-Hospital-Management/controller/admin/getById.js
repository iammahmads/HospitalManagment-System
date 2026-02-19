import { AdminModel } from "../../models/admin.js";

const getAdminById = async (req, res) => {
  const { role } = req;
  const adminId = req.params.adminId;
  let data = null;
  if (!role) {
    return res.json({ message: "no role found" });
  }
  if (!adminId) {
    return res.json({ message: "please specify adminId in params" });
  }

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

    return res.json({ message: "admin data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting admin by id: " + err,
      data: data,
    });
  }
};

export default getAdminById;
