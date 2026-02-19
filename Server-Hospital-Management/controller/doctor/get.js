import { DoctorModel } from "../../models/doctor.js";
import { verifyToken } from "../../utils/authentication/jwt.js";

const getDoctorByCookie = async (req, res) => {
  const { token } = req.cookies;
  let data = null;
  if (!token) {
    return res.json({ message: "no token cookie found", data: null });
  }
  const payLoad = verifyToken(token);
  if (!payLoad) {
    return res.json({ message: "invalid or expired token", data: null });
  }

  const doctorId = payLoad.id;
  try {
    data = await DoctorModel.findById(doctorId);

    // verifying data
    if (!data) {
      return res.json({ message: "invalid docotr id", data: null });
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
      field: data.field,
      qualification: data.qualification,
      maxAppointments: data.maxAppointments,
      appointmentHours: data.appointmentHours,
      about: data.about,
      status: data.status,
      fee: data.fee
    };

    data = tempData;

    return res.json({ message: "data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting data using cookie: " + err,
      data: null,
    });
  }
};

export default getDoctorByCookie;
