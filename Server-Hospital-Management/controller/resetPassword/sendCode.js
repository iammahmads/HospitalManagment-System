import { AdminModel } from "../../models/admin.js";
import { DoctorModel } from "../../models/doctor.js";
import { PatientModel } from "../../models/patient.js";
import sendMail from "../../utils/nodeMailer/sendMail.js";

const generateRandomNumber = () => {
  // Generate a random number between 100000 (inclusive) and 999999 (exclusive)
  const randomNumber =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return randomNumber.toString();
};

const sendCode = async (req, res) => {
  const body = req.body;
  let data = null;

  //   validatoon of form data
  if (!body) {
    return res.json({ message: "no form data found", emailSent: false });
  }
  //   validation of required data
  const { email, role } = body;

  if (!email) {
    return res.json({
      message: "no specified  email found",
      emailSent: false,
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
        emailSent: false,
      });
    }

    // generate random code
    const codeToSend = generateRandomNumber();

    // save code to database
    switch (role) {
      case "patient":
        data = await PatientModel.updateOne(
          { email: email },
          {
            $set: {
              verification: { code: codeToSend, generatedAt: Date.now() },
            },
          }
        );
        break;

      case "doctor":
        data = await DoctorModel.updateOne(
          { email: email },
          {
            $set: {
              verification: { code: codeToSend, generatedAt: Date.now() },
            },
          }
        );
        break;

      case "admin":
        data = await AdminModel.updateOne(
          { email: email },
          {
            $set: {
              verification: { code: codeToSend, generatedAt: Date.now() },
            },
          }
        );
        break;

      default:
        break;
    }

    // send code to user email
    try {
      await sendMail(
        email,
        "Password reset vrification code",
        `Your verification code is ${codeToSend}`
      );
    } catch (err) {
      return res.json({
        message: "error in sendig email: " + err,
        emailSent: false,
      });
    }

    return res.json({
      message:
        "verification code sent, please wait for 30-40s before try again",
      emailSent: true,
    });
  } catch (err) {
    return res.json({
      message: "error in sending code: " + err,
      emailSent: false,
    });
  }
};

export default sendCode;
