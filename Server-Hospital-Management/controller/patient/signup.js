import { PatientModel } from "../../models/patient.js";
import { generateToken } from "../../utils/authentication/jwt.js";
import { generateHash } from "../../utils/authentication/password.js";

const PatientSignUp = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Form Data", token: null });
  }

  //   verifying presence of data in req.body
  const { name, email, cnic, age, gender, address, password } = body;
  if (!(name && email && cnic && age && gender && address && password)) {
    return res.json({
      message: "please provide complete details of patient",
      token: null,
    });
  }

  //   generating salt and hash
  const { salt, hash } = generateHash(password);

  //  checking wheather the patient already exists
  try {
    const isPatientExist = await PatientModel.findOne({
      $or: [{ email }, { cnic }],
    });
    if (isPatientExist) {
      return res.json({ message: "patient already exists", token: null });
    }
  } catch (err) {
    return res.json({
      message: "error in checking existing patient: " + err,
      token: null,
    });
  }

  //   creating user in database
  try {
    const patient = await PatientModel.create({
      name: name,
      email: email,
      cnic: cnic,
      age: age,
      gender: gender,
      address: address,
      salt: salt,
      hash: hash,
      doctorIds: [],
    });

    //   creating token
    const payLoad = {
      id: patient._id,
      role: "patient",
    };

    const token = generateToken(payLoad);

    return res.json({ message: "patient created success", token: token });
  } catch (err) {
    return res.json({
      message: "error in creating patient: " + err,
      token: null,
    });
  }
};

export default PatientSignUp;
