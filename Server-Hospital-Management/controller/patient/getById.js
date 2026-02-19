import { PatientModel } from "../../models/patient.js";

const getPatientById = async (req, res) => {
  const { role } = req;
  const patientId = req.params.patientId;
  let data = null;
  if (!role) {
    return res.json({ message: "no role found", data: null });
  }
  if (!patientId) {
    return res.json({ message: "please specify patientId in params", data: null });
  }

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
      message: "error in getting patient by id: " + err,
      data: null,
    });
  }
};

export default getPatientById;
