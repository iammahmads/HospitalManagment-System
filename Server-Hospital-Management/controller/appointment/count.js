import { AppointmentModel } from "../../models/appointment.js";

const countAppointments = async (req, res) => {
  const { role, id } = req;
  const { status } = req.headers;
  let data = null;
  if (!(role && id)) {
    return res.json({ message: "no role or id found" });
  }
  if (!status) {
    return res.json({ message: "please specify appointment status in header" });
  }

  try {
    switch (role) {
      case "patient":
        data = await AppointmentModel.countDocuments({ patientId: id });
        break;

      case "doctor":
        data = await AppointmentModel.countDocuments({ doctorId: id });
        break;

      case "admin":
        data = await AppointmentModel.countDocuments();
        break;

      default:
        break;
    }

    return res.json({
      message: "appointments length calculation found",
      data: data,
    });
  } catch (err) {
    return res.json({
      message: "error in calculating appointments length: " + err,
      data: data,
    });
  }
};

export default countAppointments;
