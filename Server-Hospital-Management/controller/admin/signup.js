import { AdminModel } from "../../models/admin.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { generateHash } from "../../utils/authentication/password.js";

const AdminSignUp = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data" });
  }

  //   verifying presence of data in req.body
  const { name, email, cnic, age, gender, password } = body;
  if (!(name && email && cnic && age && gender && password)) {
    return res.json({ message: "please provide complete details of user" });
  }

  //   generating salt and hash
  const { salt, hash } = generateHash(password);

  //  checking wheather the admin already exists
  try {
    let isUserExist = await AdminModel.findOne({
      $or: [{ email }, { cnic }],
    });
    
    if (isUserExist) {
      return res.json({ message: "user already exists" });
    }
  } catch (err) {
    return res.json({
      message: "error in checking existing user",
      error: err,
    });
  }

  //   creating admin in database
  try {
    const admin = await AdminModel.create({
      name: name,
      email: email,
      cnic: cnic,
      age: age,
      gender: gender,
      salt: salt,
      hash: hash,
    });

    //   creating token
    const payLoad = {
      id: admin._id,
      role: "admin",
    };

    const token = generateToken(payLoad);

    return res.json({ token: token });
  } catch (err) {
    return res.json({ message: "error in creating user", error: err });
  }
};

export default AdminSignUp;
