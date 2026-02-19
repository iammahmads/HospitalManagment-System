import { AdminModel } from "../../models/admin.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { verifyHash } from "../../utils/authentication/password.js";

const AdminLogin = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data" });
  }

  //   verifying presence of data in body
  const { email, password } = body;
  if (!(email && password)) {
    return res.json({ message: "please provide details of admin" });
  }

  try {
    const admin = await AdminModel.findOne({ email: email });

    // check, wheather admin has been found or not
    if (!admin) {
      return res.json({ messsage: "no admin found" });
    }

    // verify password
    const passwordVerified = verifyHash(password, admin.salt, admin.hash);
    if (!passwordVerified) {
      return res.json({ message: "invalid admin password" });
    }

    // creating token
    const payLoad = {
      id: admin._id,
      role: "admin",
    };
    const token = generateToken(payLoad);

    return res.json({ token: token , role: "admin"});
  } catch (err) {
    return res.json({ message: "error in getting admin", error: err });
  }
};

export default AdminLogin;
