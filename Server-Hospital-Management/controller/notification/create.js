import { NotificatiionModel } from "../../models/notification.js";

const createNotification = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "no form data", added: false });
  }
  console.log("body: ", body);

  //   validation of data
  const { fromId, toId, title, fromName, message } = body;
  if (!(fromId && toId && fromName && title && message)) {
    return res.json({ message: "incomplete notification data", added: false });
  }

  try {
    const notification = await NotificatiionModel.create({
      fromId: fromId,
      toId: toId,
      title: title,
      dated: Date.now(),
      fromName: fromName,
      viewedBy: {
        admin: false,
        doctor: false,
        patient: false,
      },
      message: message,
    });

    if (!notification) {
      return res.json({
        message: "unable to create notification",
        added: false,
      });
    }

    return res.json({
      message: "notification created successfully",
      added: true,
    });
  } catch (err) {
    return res.json({
      messsage: "error in creating notification: " + err,
      added: false,
    });
  }
};

export default createNotification;
