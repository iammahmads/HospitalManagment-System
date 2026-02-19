import { DoctorModel } from "../../models/doctor.js";

const editDoctor = async (req, res) => {
  const body = req.body;
  const { role, id } = req;
  if (!body) {
    return res.json({ message: "No Form Data", updated: false });
  }
  if (!(role && id)) {
    return res.json({ message: "no specified role or id", updated: false });
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
      about
    )
  ) {
    return res.json({
      message: "please provide complete details of doctor",
      updated: false,
    });
  }

  //  checking details of new cnic
  try {
    const doctor = await DoctorModel.findOne({ cnic: cnic });

    if (doctor && doctor._id != id) {
      return res.json({
        message: "an doctor with same cnic already exists",
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
    const doctor = await DoctorModel.findOne({ email: email });

    if (doctor && doctor._id != id) {
      return res.json({
        message: "an doctor with same email already exists",
        updated: false,
      });
    }
  } catch (err) {
    return res.json({
      message: "error in checking eamil of new details: " + err,
      updated: false,
    });
  }

  //   creating doctor in database
  try {
    await DoctorModel.updateOne(
      { _id: id },
      {
        name: name,
        email: email,
        cnic: cnic,
        age: age,
        gender: gender,
        field: field,
        qualification: qualification,
        maxAppointments: maxAppointments,
        appointmentHours: {
          start: appointmentHoursStart,
          end: appointmentHoursEnd,
        },
        about: about,
      }
    );

    return res.json({ message: "doctor details updated", updated: true });
  } catch (err) {
    return res.json({
      message: "error in creating doctor: " + err,
      updated: false,
    });
  }
};

export default editDoctor;
