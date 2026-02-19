import { NotificatiionModel } from "../../models/notification.js";

const getNotificationById = async (req, res) => {
  const { role } = req;
  const notificationId = req.params.notificationId;
  let data = null;
  if (!role) {
    return res.json({ message: "no role found", data: null });
  }
  if (!notificationId) {
    return res.json({
      message: "please specify notificationId in params",
      data: null,
    });
  }

  try {
    data = await NotificatiionModel.findById(notificationId);

    //
    if (!data) {
      return res.json({ message: "invalid notification id", data: null });
    }

    // set notification sattus to viewed
    switch (role) {
      case "patient":
        if (!data.viewedBy.patient) {
          data.viewedBy.patient = true;
          await data.save();
        }
        break;

      case "doctor":
        if (!data.viewedBy.doctor) {
          data.viewedBy.doctor = true;
          await data.save();
        }
        break;

      case "admin":
        if (!data.viewedBy.admin) {
          data.viewedBy.admin = true;
          await data.save();
        }
        break;

      default:
        break;
    }

    return res.json({ message: "notification data found", data: data });
  } catch (err) {
    return res.json({
      message: "error in getting notification by id: " + err,
      data: null,
    });
  }
};

export default getNotificationById;
