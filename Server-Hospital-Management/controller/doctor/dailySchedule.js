import { DoctorModel } from "../../models/doctor.js";

const dailySchedule = async (req, res) => {
  const headers = req.headers;
  const doctorId = headers.doctorid;
  const time = Number(headers.time);
  let data = null;

  //   verifying presence of doctor id
  if (!(doctorId && time)) {
    return res.json({
      message: "please provide necessary details",
      data: null,
    });
  }

  // check wetther given time is greater than 7 days or not
  const todayDate = new Date().setUTCHours(0, 0, 0, 0);
  const maxDate = new Date(todayDate + 7 * 24 * 60 * 60 * 1000).getTime();
  if (time > maxDate) {
    return res.json({
      message: "given time is greater than allowed time",
      data: null,
    });
  }

  try {
    // get all schdules of doctor and find required one
    const tempDoctor = await DoctorModel.findOne(
      { _id: doctorId },
      { schedule: 1, status: 1 }
    );

    // checking status of doctor
    if (tempDoctor.status != "approved") {
      return res.json({ message: "Doctor is not approved yet", data: null });
    }

    const allSchedules = tempDoctor.schedule;
    data = allSchedules.find(
      (scheduleItem) =>
        time >= scheduleItem.day.start && time < scheduleItem.day.end
    );

    // push new data, if there is no present schedule
    if (!data) {
      try {
        // create new entry
        const newStartDate =  new Date(new Date(time).setUTCHours(0, 0, 0, 0)).getTime();
        await DoctorModel.updateOne(
          { _id: doctorId, status: "approved" },
          {
            $push: {
              schedule: {
                day: {
                  start: newStartDate,
                  end: new Date(newStartDate + 1 * 24 * 60 * 60 * 1000).getTime(),
                },
                currentAppointments: 0,
                appointedHours: [],
              },
            },
          }
        );

        //  get all schdules of doctor and find required one, after inserting data
        const tempDoctor = await DoctorModel.findOne(
          { _id: doctorId },
          { schedule: 1 }
        );
        const allSchedules = tempDoctor.schedule;
        data = allSchedules.find(
          (scheduleItem) =>
            time >= scheduleItem.day.start && time < scheduleItem.day.end
        );
        // console.log("allSchedules: ", allSchedules)
        // console.log("time: ", time)
        // console.log("data: ", data)
      } catch (err) {
        return res.json({
          message: "error in adding new schdule to doctor: " + err,
          data: null,
        });
      }
    }

    return res.json({ message: "schdule found", data: data });
  } catch (err) {
    return res.json({
      message: "error in finding schedule: " + err,
      data: null,
    });
  }
};

export default dailySchedule;
