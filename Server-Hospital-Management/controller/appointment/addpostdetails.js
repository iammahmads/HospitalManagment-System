import { AppointmentModel } from "../../models/appointment.js";

const addPostDetails = async (req, res) => {
  const { post, appointmentId } = req.body;
  if (!(post && appointmentId)) {
    return res.json({ message: "No post details Data", updated: false });
  }

  //   check for original doctor is adding post details
  const doctorId = req.id;
  if (!doctorId) {
    return res.json({
      message: "you are not autorized to add post details",
      updated: false,
    });
  }

  try {
    const appointment = await AppointmentModel.findOne({
      _id: appointmentId,
      doctorId: doctorId,
    });

    // no appointment found
    if (!appointment) {
      return res.json({
        message: "you are not specifed doctor to do this",
        updated: false,
      });
    }

    // update appointmet
    if (appointment.status == "deleted") {
      return res.json({
        message: "this appointment has already deleted",
        updated: false,
      });
    }
    appointment.details.postDetailsWritten = true;
    appointment.details.post = post;
    appointment.status = "completed";
    await appointment.save();

    return res.json({
      mesage: "post data added to appointment",
      updated: true,
    });
  } catch (err) {
    return res.json({
      message: "error while updating post details: " + err,
      updated: false,
    });
  }
};

export default addPostDetails;
