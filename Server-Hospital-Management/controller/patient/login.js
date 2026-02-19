import { PatientModel } from "../../models/patient.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { verifyHash } from "../../utils/authentication/password.js";

const PatientLogin = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data" });
  }

  //   verifying presence of data in body
  const { email, password } = body;
  if (!(email && password)) {
    return res.json({ message: "please provide details of patient" });
  }

  try {
    const patient = await PatientModel.findOne({ email: email });

    // check, wheather patient has been found or not
    if (!patient) {
      return res.json({ messsage: "no patient found" });
    }

    // verify password
    const passwordVerified = verifyHash(password, patient.salt, patient.hash);
    if (!passwordVerified) {
      return res.json({ message: "invalid patient password" });
    }

    // creating token
    const payLoad = {
      id: patient._id,
      role: "patient",
    };
    const token = generateToken(payLoad);

    return res.json({ token: token });
  } catch (err) {
    return res.json({ message: "error in getting patient", error: err });
  }
};

export default PatientLogin;
