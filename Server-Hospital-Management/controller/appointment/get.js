import { AppointmentModel } from "../../models/appointment.js";

const getAppointments = async (req, res) => {
  const { role, id } = req;
  const { itemstoshowatatime, start } = req.headers;
  let data = null;
  let count = 0;
  const currentDate = Date.now();
  if (!(role && id)) {
    return res.json({ message: "no role or id found", data: null });
  }
  if (!(itemstoshowatatime && start)) {
    return res.json({
      message:
        "please specify appointment start and itemstoshowatatime  in header",
      data: null,
    });
  }

  try {
    switch (role) {
      case "patient":
        data = await AppointmentModel.find({ patientId: id })
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({ patientId: id });
        break;

      case "doctor":
        data = await AppointmentModel.find({ doctorId: id })
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({ doctorId: id });
        break;

      case "admin":
        data = await AppointmentModel.find({})
          .skip(start)
          .limit(itemstoshowatatime)
          .sort({ natural: -1 });
        count = await AppointmentModel.countDocuments({});
        break;

      default:
        break;
    }

    // check for appointment time has been passed or  not
    data.forEach(async (dataItem) => {
      if (currentDate > dataItem.dated && dataItem.status == "pending") {
        dataItem.status = "deleted";
        dataItem.timePassed = true;
        await dataItem.save();
      }
    });

    return res.json({ message: "appointments data found", data: data, count });
  } catch (err) {
    return res.json({
      message: "error in getting appointments by id: " + err,
      data: null,
    });
  }
};

export default getAppointments;
