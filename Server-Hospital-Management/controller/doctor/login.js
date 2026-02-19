import { DoctorModel } from "../../models/doctor.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { verifyHash } from "../../utils/authentication/password.js";

const DoctorLogin = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data" });
  }

  //   verifying presence of data in body
  const { email, password } = body;
  if (!(email && password)) {
    return res.json({ message: "please provide details of doctor" });
  }

  try {
    const doctor = await DoctorModel.findOne({ email: email });

    // check, wheather doctor has been found or not
    if (!doctor) {
      return res.json({ messsage: "no doctor found" });
    }

    // verify password
    const passwordVerified = verifyHash(password, doctor.salt, doctor.hash);
    if (!passwordVerified) {
      return res.json({ message: "invalid doctor password" });
    }

    // creating token
    const payLoad = {
      id: doctor._id,
      role: "doctor",
    };
    const token = generateToken(payLoad);

    return res.json({ token: token, role: "doctor" });
  } catch (err) {
    return res.json({ message: "error in getting doctor", error: err });
  }
};

export default DoctorLogin;
