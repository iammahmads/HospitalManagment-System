import { DoctorModel } from "../../models/doctor.js";

const approveDoctor = async (req, res) => {
  const headers = req.headers;
  const doctorId = headers.doctorid;

  // verification of data
  if (!doctorId) {
    return res.json({ message: "please provide doctor id", approved: false });
  }

  try {
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ message: "no doctor found", approved: false });
    }

    // check if douctor is already approved
    if (doctor.status == "approved") {
      return res.json({
        message: "doctor is alaready approved",
        approved: false,
      });
    }

    await DoctorModel.updateOne(
      { _id: doctorId },
      {
        status: "approved",
        schedule: [
          {
            day: { start: 0, end: 0 },
            currentAppointments: 0,
            appointedHours: [],
          },
        ],
      }
    );
    return res.json({ message: "doctor approved", approved: true });
  } catch (err) {
    return res.json({
      message: "error in approving doctor: " + err,
      approved: false,
    });
  }
};

export default approveDoctor;
