import { AppointmentModel } from "../../models/appointment.js";
import { DoctorModel } from "../../models/doctor.js";
import { Invoice } from "../../models/invoice.js";
import { PatientModel } from "../../models/patient.js";

const createAppointment = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.json({ message: "No Appointment Data", added: false });
  }

  //   verifying presence of data in body
  const {
    doctorId,
    patientCnic,
    doctorName,
    doctorField,
    patientName,
    hoursTime,
    dated,
    pre,
  } = body;
  if (
    !(
      doctorId &&
      patientCnic &&
      doctorName &&
      doctorField &&
      patientName &&
      hoursTime &&
      dated &&
      pre
    )
  ) {
    return res.json({
      message: "please provide details of appointment",
      added: false,
    });
  }

  //   creating appointment in database
  try {
    // get patient id using cnic
    const tempPatient = await PatientModel.findOne({ cnic: patientCnic });
    if (!tempPatient) {
      return res.json({
        message: "no patient exist with this cnic",
        added: false,
      });
    }

    const appointment = await AppointmentModel.create({
      doctorId: doctorId,
      patientId: tempPatient._id,
      doctorName: doctorName,
      doctorField: doctorField,
      patientName: patientName,
      dated: dated,
      hoursTime: hoursTime,
      timePassed: false,
      status: "pending",
      details: {
        pre: pre,
        postDetailsWritten: false,
      },
    });

    if (!appointment) {
      return res.json({
        message: "error in creating appoitmeny",
        added: false,
      });
    }

    let tempDoctor;
    // update doctor timetable
    try {
      //  get all schdules of doctor and find required one, after inserting data
      tempDoctor = await DoctorModel.findOne(
        { _id: doctorId, status: "approved" },
        { appointmentHours: 1, schedule: 1, fee: 1 }
      );

      // no doctor found
      if (!tempDoctor) {
        return res.json({
          message: "doctor not found or approved yet",
          added: false,
        });
      }

      // doctor appointment time
      if (
        !(
          hoursTime >= tempDoctor.appointmentHours.start &&
          hoursTime < tempDoctor.appointmentHours.end
        )
      ) {
        return res.json({
          message: "your appointment time is not in doctor time table",
          added: false,
        });
      }

      const allSchedules = tempDoctor.schedule;
      let matchedSchedule = allSchedules.find(
        (scheduleItem) =>
          Number(dated) >= scheduleItem.day.start &&
          Number(dated) < scheduleItem.day.end
      );

      if (!matchedSchedule) {
        // push new schedule
        const todayDate = new Date(
          new Date(dated).setUTCHours(0, 0, 0, 0)
        ).getTime();
        const endDate = new Date(todayDate + 1 * 24 * 60 * 60 * 1000).getTime();
        try {
          await DoctorModel.findOneAndUpdate(
            { _id: doctorId, status: "approved" },
            {
              $push: {
                schedule: {
                  day: {
                    start: todayDate,
                    end: endDate,
                  },
                  currentAppointments: 0,
                  appointedHours: [],
                },
              },
            }
          );

          // again checking for inserted schedule
          tempDoctor = await DoctorModel.findOne(
            { _id: doctorId },
            { appointmentHours: 1, schedule: 1 }
          );
          const allSchedules = tempDoctor.schedule;
          matchedSchedule = allSchedules.find(
            (scheduleItem) =>
              Number(dated) >= scheduleItem.day.start &&
              Number(dated) < scheduleItem.day.end
          );

          // add doctor id to doctor id array in patient
        } catch (err) {
          return res.json({
            message: "error in adding new schdule to doctor: " + err,
            added: false,
          });
        }
      }

      // making required changes
      matchedSchedule.currentAppointments++;
      matchedSchedule.appointedHours.push(
        hoursTime - tempDoctor.appointmentHours.start
      );
      // saving the changes
      await tempDoctor.save();

    } catch (err) {
      return res.json({
        message: "unable to update doctor data: " + err,
        added: false,
      });
    }

    // add doctor id to doctorids field in patient
    try {
      const patient = await PatientModel.updateOne(
        { cnic: patientCnic },
        {
          $push: { doctorIds: doctorId },
        }
      );

      if (!patient.modifiedCount) {
        return res.json({
          messae: "unable to attach doctorid to patient",
          added: false,
        });
      }
    } catch (err) {
      return res.json({
        message: "error while attaching doctorid to patient: " + err,
        added: false,
      });
    }

    console.log(tempDoctor)
    // creating invoice
    const fee = tempDoctor.fee;
    const gstRate = 0.15;
    const gst = (fee * gstRate).toFixed(2);      // 15% GST
    const subtotal = (fee - gst).toFixed(2);     // Fee before GST
    const total = fee;

    await Invoice.create({
      appointment: appointment._id,
      doctor: tempDoctor._id,
      patient: tempPatient._id,
      fee,
      subtotal,
      gst,
      total
    });

    return res.json({ message: "appointment added to database", added: true });
  } catch (err) {
    console.log(err)
    return res.json({
      message: "error while adding appointment to database",
      added: false,
    });
  }
};

export default createAppointment;
