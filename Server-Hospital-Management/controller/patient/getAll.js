import { PatientModel } from "../../models/patient.js";

const getAllPatients = async (req, res) => {
  const { role, id } = req;
  const { itemstoshowatatime, start } = req.headers;
  let data = null;
  let count = 0;

  //   validate role and id
  if (!(role && id)) {
    return res.json({ message: "no role or id found", data: data });
  }
  if (!(itemstoshowatatime && start)) {
    return res.json({
      message: "please specify start and itemstoshowatatime in header",
    });
  }

  try {
    switch (role) {
      case "doctor":
        data = await PatientModel.find({ doctorIds: { $in: id } })
          .skip(start)
          .limit(itemstoshowatatime);
        count = await PatientModel.countDocuments({ doctorIds: { $in: id } });
        break;

      case "admin":
        data = await PatientModel.find().skip(start).limit(itemstoshowatatime);
        count = await PatientModel.countDocuments({});
        break;

      default:
        break;
    }


    return res.json({ message: "patients found", data: data, count });
  } catch (err) {
    return res.json({
      message: "error in getting patiets: " + err,
      data: data,
    });
  }
};

export default getAllPatients;
