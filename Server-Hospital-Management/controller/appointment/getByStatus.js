import { AppointmentModel } from "../../models/appointment.js";

const getAppointmentsByStatus = async (req, res) => {
  const { role, id } = req;
  const { status, itemstoshowatatime, start } = req.headers;
  let data = null;
  let count = 0;
  const cuurrentDate = Date.now()
  if (!(role && id)) {
    return res.json({ message: "no role or id found", data: null });
  }
  if (!(status && itemstoshowatatime && start)) {
    return res.json({
      message:
        "please specify appointment status, itemstoshowatatime and start in header",
      data: null,
    });
  }

  try {
    switch (role) {
      case "patient":
        data = await AppointmentModel.find({ patientId: id, status: status })
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({
          patientId: id,
          status: status,
        });
        break;

      case "doctor":
        data = await AppointmentModel.find({ doctorId: id, status: status })
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({
          doctorId: id,
          status: status,
        });
        break;

      case "admin":
        data = await AppointmentModel.find({ status: status })
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({
          status: status,
        });
        break;
      default:
        break;
    }

    // check for appointment time has been passed or  not
    data.forEach(async (dataItem) => {
      if (cuurrentDate > dataItem.dated && dataItem.status == "pending") {
        dataItem.status = "deleted";
        dataItem.timePassed = true;
        await dataItem.save();
      }
    });

    return res.json({ message: "appointments data found", data: data, count });
  } catch (err) {
    return res.json({
      message: "error in getting appointments by status: " + err,
      data: null,
    });
  }
};

export default getAppointmentsByStatus;
