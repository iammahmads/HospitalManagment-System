import { AppointmentModel } from "../../models/appointment.js";

const approveAppointment = async (req, res) => {
  const { role, id } = req;
  const appointmentId = req.headers.appointmentid;

  if (!(role == "doctor" || role == "admin")) {
    return res.json({
      message: "you are not authorized to approve any appointment",
      approved: false,
    });
  }

  if (!appointmentId) {
    return res.json({
      message: "please specify appointmentId in header",
      approved: false,
    });
  }

  try {
    const appointment = await AppointmentModel.updateOne(
      {
        _id: appointmentId,
        status: "pending",
        timePassed: false,
      },
      { status: "scheduled" }
    );

    // check, wheather appointment is modified
    if (!appointment.modifiedCount) {
      return res.json({
        message: "unable to find appointment",
        approved: false,
      });
    }

    return res.json({ message: "appointment approved", approved: true });
  } catch (err) {
    return res.json({
      message: "error in approving appointment: " + err,
      approved: false,
    });
  }
};

export default approveAppointment;
