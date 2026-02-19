import { AdminModel } from "../../models/admin.js";
import { DoctorModel } from "../../models/doctor.js";
import { PatientModel } from "../../models/patient.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { generateHash } from "../../utils/authentication/password.js";

const verifyCode = async (req, res) => {
  const body = req.body;
  let data = null;

  //   validatoon of form data
  if (!body) {
    return res.json({ message: "no form data found", token: null });
  }

  //   validation of required data
  const { email, codeToVerify, password, role } = body;
  if (!(email && codeToVerify && password)) {
    return res.json({
      message: "no specified email, password or codeToVerify found",
      token: null,
    });
  }

  //   finding user
  try {

    switch (role) {
      case "admin":
        data = await AdminModel.findOne({ email: email });
        break;
      case "doctor":
        data = await DoctorModel.findOne({ email: email });
        break;
      case "patient":
        data = await PatientModel.findOne({ email: email });
        break;
      default:
        break
    }

    // in case of no data found
    if (!data) {
      return res.json({
        message: "no data found for specified email",
        token: null,
      });
    }

    // validate presence of code in data
    if (!data.verification.code) {
      return res.json({
        message: "no verification code found for specified email",
        token: null,
      });
    }

    // validate of code expriy time i.e 15 minutes = 900,000 mili-seconds
    const currentTime = Date.now();
    const fifteenMiutes = 900000;
    if (currentTime - Number(data.verification.generatedAt) > fifteenMiutes) {
      return res.json({
        message: "code expired",
        token: null,
      });
    }

    // validate code
    if (data.verification.code == codeToVerify) {
      const { hash, salt } = generateHash(password);
      data.hash = hash;
      data.salt = salt;
      await data.save();

      // generating token
      const payLoad = {
        id: data._id,
        role: role,
      };
      const token = generateToken(payLoad);
      return res.json({ message: "code verified", token: token, role: role });
    }

    // if code is not validated, then
    return res.json({
      message: "wrong verification code",
      token: null,
    });
  } catch (err) {
    return res.json({
      message: "error in verifying code: " + err,
      token: null,
    });
  }
};

export default verifyCode;
