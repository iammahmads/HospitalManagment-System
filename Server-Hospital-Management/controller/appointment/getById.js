import { CurrencyCodes } from "validator/lib/isISO4217.js";
import { AppointmentModel } from "../../models/appointment.js";

const getAppointmentById = async (req, res) => {
  const { role } = req;
  const appointmentId = req.params.appointmentId;
  let data = null;
  const cuurrentTimeMs = Date.now();
  if (!role) {
    return res.json({ message: "no role found", data: null });
  }
  if (!appointmentId) {
    return res.json({
      message: "please specify appointmentId in params",
      data: null,
    });
  }

  try {
    data = await AppointmentModel.findById(appointmentId);

    //
    if (!data) {
      return res.json({ message: "invalid appointment id", data: null });
    }


    const appointmentDate = new Date(data.dated);
    appointmentDate.setHours(data.hoursTime, 0, 0, 0);

    const appointmentTimeMs = appointmentDate.getTime()
    const hasTimePassed = cuurrentTimeMs > appointmentTimeMs

    // check for appointment time has been passed or  not
    if (hasTimePassed && data.timePassed == false) {
      data.timePassed = true;
      await data.save();
    }

    const tempData = {
      id: data._id,
      doctorId: data.doctorId,
      patientId: data.patientId,
      doctorName: data.doctorName,
      doctorField: data.doctorField,
      patientName: data.patientName,
      dated: data.dated,
      timePassed: data.timePassed,
      details: data.details,
      hoursTime: data.hoursTime,
      status: data.status,
    };

    data = tempData;

    return res.json({ message: "appointments data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting appointment by id: " + err,
      data: null,
    });
  }
};

export default getAppointmentById;
