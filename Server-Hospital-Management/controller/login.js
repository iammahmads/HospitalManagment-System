import { AdminModel } from "../models/admin.js";
import { DoctorModel } from "../models/doctor.js";
import { PatientModel } from "../models/patient.js";
import { generateToken } from "../utils/authentication/jwt.js";
import { verifyHash } from "../utils/authentication/password.js";

const Login = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data", token: null });
  }

  //   verifying presence of data in body
  const { email, password, role } = body;
  if (!(email && password && role)) {
    return res.json({ message: "please provide email and password", token: null });
  }

  //   we will find user in patient, docotr and admin

  let user;
  try {
    switch (role) {
      case "admin":
        user = await AdminModel.findOne({ email: email });
        break;
      case "doctor":
        user = await DoctorModel.findOne({ email: email });
        break;
      case "patient":
        user = await PatientModel.findOne({ email: email });
        break;
      default:
        break
    }


    if (!user) {
      return res.json({ message: "no user found!", token: null });
    }

    // verify password
    const passwordVerified = verifyHash(password, user.salt, user.hash);
    if (!passwordVerified) {
      return res.json({ message: "invalid password", token: null });
    }

    // creating token
    const payLoad = {
      id: user._id,
      role: role,
    };
    const token = generateToken(payLoad);

    return res.json({ message: "login success", token: token, role });
  } catch (err) {
    return res.json({ message: "error in getting user: " + err, token: null });
  }
};

export default Login;
