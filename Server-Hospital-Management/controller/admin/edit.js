import { AdminModel } from "../../models/admin.js";

const editAdmin = async (req, res) => {
  const body = req.body;
  const { role, id } = req;
  if (!body) {
    return res.json({ message: "No Form Data", updated: false });
  }
  if (!(role && id)) {
    return res.json({ message: "no specified role or id", updated: false });
  }

  //   verifying presence of data in req.body
  const { name, email, cnic, age, gender } = body;
  if (!(name && email && cnic && age && gender)) {
    return res.json({
      message: "please provide complete details of admin",
      updated: false,
    });
  }

  //  checking details of new cnic
  try {
    const admin = await AdminModel.findOne({ cnic: cnic });

    if (admin && admin._id != id) {
      return res.json({
        message: "an admin with same cnic already exists",
        updated: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "error in checking cnic of new details: " + err,
      updated: false,
    });
  }

  //  checking details of new email
  try {
    const admin = await AdminModel.findOne({ email: email });

    if (admin && admin._id != id) {
      return res.json({
        message: "an admin with same email already exists",
        updated: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "error in checking eamil of new details: " + err,
      updated: false,
    });
  }

  //   creating admin in database
  try {
    await AdminModel.updateOne(
      { _id: id },
      {
        name: name,
        email: email,
        cnic: cnic,
        age: age,
      }
    );

    return res.json({ message: "admin details updated", updated: true });
  } catch (err) {
    return res.json({
      message: "error in creating admin: " + err,
      updated: false,
    });
  }
};

export default editAdmin;
