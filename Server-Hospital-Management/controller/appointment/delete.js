import { AppointmentModel } from "../../models/appointment.js";
import { DoctorModel } from "../../models/doctor.js";

const deleteAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;
  if (!appointmentId) {
    return res.json({
      message: "please provide id of appointment",
      deleted: false,
    });
  }

  const { role, id } = req;
  if (!(role && id)) {
    return res.json({
      message: "no role or id",
      deleted: false,
    });
  }

  //   creating appointment in database
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "deleted" }
    );

    if (!appointment) {
      return res.json({
        message: "error in deleting appoitment",
        deleted: false,
      });
    }

    // status can be changed to deleted in case of pending only
    if (appointment.status != "pending") {
      return res.json({
        messagE: "appointment can be deleted in pending state only",
        deleted: false,
      });
    }

    // check for the real doctor of appointment
    if (role == "doctor" && appointment.doctorId != id) {
      return res.json({
        message: "you are not specified doctor of this appointment",
        deleted: false,
      });
    }

    // update doctor timetable
    try {
      //  get all schdules of doctor and find required one, after adding appointment
      let tempDoctor = await DoctorModel.findOne(
        { _id: appointment.doctorId },
        { appointmentHours: 1, schedule: 1 }
      );
      const allSchedules = tempDoctor.schedule;
      let matchedSchedule = allSchedules.find(
        (scheduleItem) =>
          Number(appointment.dated) > scheduleItem.day.start &&
          Number(appointment.dated) <= scheduleItem.day.end
      );

      if (!matchedSchedule) {
        return res.json({
          message: "no schedule found for current apointment",
          deleted: false,
        });
      }

      // making required changes
      matchedSchedule.currentAppointments--;
      const tempAppointedHours = matchedSchedule.appointedHours.filter(
        (hourItem) =>
          hourItem != appointment.hoursTime - tempDoctor.appointmentHours.start
      );
      matchedSchedule.appointedHours = tempAppointedHours;
      // saving the changes
      await tempDoctor.save();
    } catch (err) {
      return res.json({
        message: "unable to update doctor data: " + err,
        deleted: false,
      });
    }

    return res.json({
      message: "appointment deleted from database",
      deleted: true,
    });
  } catch (err) {
    return res.json({
      message: "error while deleting appointment from database",
      added: false,
    });
  }
};

export default deleteAppointmentById;
