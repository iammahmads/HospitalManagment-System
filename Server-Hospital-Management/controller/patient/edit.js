import { PatientModel } from "../../models/patient.js";

const editPatient = async (req, res) => {
  const body = req.body;
  const { role, id } = req;
  if (!body) {
    return res.json({ message: "No Form Data", updated: false });
  }
  if (!(role && id)) {
    return res.json({ message: "no specified role or id", updated: false });
  }

  //   verifying presence of data in req.body
  const { name, email, cnic, age, gender, address } = body;
  if (!(name && email && cnic && age && gender && address)) {
    return res.json({
      message: "please provide complete details of patient",
      updated: false,
    });
  }

  //  checking details of new cnic
  try {
    const patient = await PatientModel.findOne({ cnic: cnic });

    if (patient && patient._id != id) {
      return res.json({
        message: "a patient with same cnic already exists",
        updated: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "error in checking cnic of new details: " + err,
      updated: false,
    });
  }

  //  checking details of new email
  try {
    const patient = await PatientModel.findOne({ email: email });

    if (patient && patient._id != id) {
      return res.json({
        message: "an patient with same email already exists",
        updated: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "error in checking eamil of new details: " + err,
      updated: false,
    });
  }

  //   updating user in database
  try {
    await PatientModel.updateOne(
      { _id: id },
      {
        name: name,
        email: email,
        cnic: cnic,
        age: age,
        gender: gender,
        address: address,
      }
    );

    return res.json({ message: "patient details updated", updated: true });
  } catch (err) {
    return res.json({ message: "error in creating patient", updated: false });
  }
};

export default editPatient;
