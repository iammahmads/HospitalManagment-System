import { DoctorModel } from "../../models/doctor.js";

const AllDcotors = async (req, res) => {
  let data = null;
  const { itemstoshowatatime, start } = req.headers;
  if (!(itemstoshowatatime && start)) {
    return res.json({
      message: "please specify itemstoshowatatime and start in header",
      data: null,
    });
  }

  try {
    if (itemstoshowatatime == -1) {
      data = await DoctorModel.find(
        { status: "approved" },
        { _id: 1, name: 1, field: 1, maxAppointments: 1, appointmentHours: 1 }
      );
    } else {
      data = await DoctorModel.find(
        { status: "approved" },
        { _id: 1, name: 1, field: 1, maxAppointments: 1, appointmentHours: 1 }
      )
        .skip(start)
        .limit(itemstoshowatatime);
    }
    const count = await DoctorModel.countDocuments({});
    const tempData = data.map((item) => ({
      id: item._id,
      name: item.name,
      maxAppointments: item.maxAppointments,
      field: item.field,
      appointmentHours: item.appointmentHours,
    }));
    data = tempData;

    return res.json({
      message: "name and fields of all doctors",
      data: data,
      count,
    });
  } catch (err) {
    return res.json({
      message: "error in getting dcotr name and fields data: " + err,
      data: data,
    });
  }
};

export default AllDcotors;
