import { NotificatiionModel } from "../../models/notification.js";

const getNotifications = async (req, res) => {
  const { role, id } = req;
  const { itemstoshowatatime, start, viewedbyadmin } = req.headers;
  let data = null;
  let count = 0;
  if (!(role && id)) {
    return res.json({ message: "no role or id found", data: null });
  }
  if (!(itemstoshowatatime && start && viewedbyadmin)) {
    return res.json({
      message:
        "please specify notification start, viewed by and itemstoshowatatime  in header",
      data: null,
    });
  }

  try {
    if (role == "admin") {
      if (!viewedbyadmin) {
        data = await NotificatiionModel.find({ viewedBy: { admin: false } })
          .skip(start)
          .limit(itemstoshowatatime);
        count = await NotificatiionModel.countDocuments({});
      } else {
        data = await NotificatiionModel.find({})
          .skip(start)
          .limit(itemstoshowatatime);
        count = await NotificatiionModel.countDocuments({});
      }
    } else {
      data = await NotificatiionModel.find({ toId: id })
        .skip(start)
        .limit(itemstoshowatatime);
      count = await NotificatiionModel.countDocuments({ toId: id });
    }

    return res.json({ message: "notifications data found", data: data, count });
  } catch (err) {
    return res.json({
      message: "error in getting notifications: " + err,
      data: null,
    });
  }
};

export default getNotifications;
