import { DoctorModel } from "../../models/doctor.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { generateHash } from "../../utils/authentication/password.js";

const DoctorSignUp = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data" });
  }

  //   verifying presence of data in req.body
  const {
    name,
    email,
    cnic,
    age,
    gender,
    field,
    qualification,
    maxAppointments,
    appointmentHoursStart,
    appointmentHoursEnd,
    about,
    password,
    fee
  } = body;
  if (
    !(
      name &&
      email &&
      cnic &&
      age &&
      gender &&
      field &&
      qualification &&
      maxAppointments &&
      appointmentHoursStart &&
      appointmentHoursEnd &&
      about &&
      password && fee
    )
  ) {
    return res.json({ message: "please provide complete details of doctor" });
  }

  //   generating salt and hash
  const { salt, hash } = generateHash(password);

  //  checking wheather the doctor already exists
  try {
    const isDoctorExist = await DoctorModel.findOne({
      $or: [{ email }, { cnic }],
    });
    if (isDoctorExist) {
      return res.json({ message: "doctor already exists" });
    }
  } catch (err) {
    return res.json({
      message: "error in checking existing doctor",
      error: err,
    });
  }

  //   creating doctor in database
  try {
    const doctor = await DoctorModel.create({
      name: name,
      email: email,
      cnic: cnic,
      age: age,
      gender: gender,
      field: field,
      qualification: qualification,
      status: "pending",
      maxAppointments: maxAppointments,
      currentAppointments: 0,
      appointedHours: [],
      appointmentHours: {
        start: appointmentHoursStart,
        end: appointmentHoursEnd,
      },
      schedule: [],
      about: about,
      salt: salt,
      hash: hash,
      fee: Number(fee)
    });

    //   creating token
    const payLoad = {
      id: doctor._id,
      role: "doctor",
    };

    const token = generateToken(payLoad);

    return res.json({ token: token });
  } catch (err) {
    return res.json({ message: "error in creating doctor", error: err });
  }
};

export default DoctorSignUp;
