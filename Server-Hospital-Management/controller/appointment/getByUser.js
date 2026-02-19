import { AppointmentModel } from "../../models/appointment.js";

const getAppointmentsByUser = async (req, res) => {
  const { role, id } = req;
  const { itemstoshowatatime, start, user, userid } = req.headers;
  let data = null;
  let count = 0;
  const currentDate = Date.now();
  if (!(role && id)) {
    return res.json({ message: "no role or id found", data: null });
  }
  if (!(user && userid && itemstoshowatatime && start)) {
    return res.json({
      message:
        "please specify appointment user,  itemstoshowatatime and start in header",
      data: null,
    });
  }
  console.log("useid: ", userid);

  try {
    data = await AppointmentModel.find({ patientId: userid })
      .skip(start)
      .limit(itemstoshowatatime)
      .sort({ natural: -1 });
    count = await AppointmentModel.countDocuments({ patientId: userid });

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
      message: "error in getting appointments by user and user id: " + err,
      data: null,
    });
  }
};

export default getAppointmentsByUser;
