import { PatientModel } from "../../models/patient.js";
import { verifyToken } from "../../utils/authentication/jwt.js";

const getPatientByCookie = async (req, res) => {
  const { token } = req.cookies;
  let data = null;
  if (!token) {
    return res.json({ message: "no token cookie found", data: null });
  }
  const payLoad = verifyToken(token);
  if (!payLoad) {
    return res.json({ message: "invalid or expired token", data: null });
  }

  const patientId = payLoad.id;
  try {
    data = await PatientModel.findById(patientId);

    // verifying data
    if (!data) {
      return res.json({ message: "invalid patient id", data: null });
    }

    // sending only necessary details
    const tempData = {
      id: data._id,
      name: data.name,
      cnic: data.cnic,
      age: data.age,
      gender: data.gender,
      email: data.email,
      address: data.address,
      about: data.about,
    };

    data = tempData;

    return res.json({ message: "patient data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting patient using cookie: " + err,
      data: null,
    });
  }
};

export default getPatientByCookie;
