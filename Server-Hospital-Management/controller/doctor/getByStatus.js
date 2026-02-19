import { DoctorModel } from "../../models/doctor.js";

const getDcotorsByStatus = async (req, res) => {
  let data = null;
  const { itemstoshowatatime, start, status } = req.headers;
  if (!(itemstoshowatatime && start)) {
    return res.json({
      message: "please specify sats, itemstoshowatatime and start in header",
      data: null,
    });
  }

  try {
    data = await DoctorModel.find(
      { status: status },
      { _id: 1, name: 1, field: 1, maxAppointments: 1, appointmentHours: 1 }
    );

    const count = await DoctorModel.countDocuments({ status: status });
    const tempData = data.map((item) => ({
      id: item._id,
      name: item.name,
      maxAppointments: item.maxAppointments,
      field: item.field,
      appointmentHours: item.appointmentHours,
    }));
    data = tempData;

    return res.json({
      message: "of all doctors having status " + status,
      data: data,
      count,
    });
  } catch (err) {
    return res.json({
      message: "error in getting dcotor name and fields data: " + err,
      data: data,
    });
  }
};

export default getDcotorsByStatus;
