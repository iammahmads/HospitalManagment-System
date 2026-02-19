import { DoctorModel } from "../../models/doctor.js";

const getDoctorById = async (req, res) => {
  const doctorId = req.params.doctorId;
  const { role } = req;

  //   verifying doctor Id
  if (!doctorId) {
    return res.json({
      message: "Please attach doctorId",
      data: null,
    });
  }
  if (!role) {
    return res.json({ message: "no role found", data: null });
  }

  try {
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ message: "no doctor found", data: null });
    }

    const doctorData = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.cnic,
      gender: doctor.gender,
      cnic: doctor.cnic,
      age: doctor.age,
      field: doctor.field,
      status: doctor.status,
      qualification: doctor.qualification,
      maxAppointments: doctor.maxAppointments,
      appointedHours: doctor.appointedHours,
      appointmentHours: doctor.appointmentHours,
      about: doctor.about,
      fee: doctor.fee,
    };

    return res.json({ message: "Doctor found", data: doctorData });
  } catch (err) {
    return res.json({
      message: "error in finding doctor: " + err,
      data: null,
    });
  }
};

export default getDoctorById;
