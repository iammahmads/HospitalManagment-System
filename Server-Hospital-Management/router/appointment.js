import express from "express";
import createAppointment from "../controller/appointment/create.js";
import getAppointments from "../controller/appointment/get.js";
import checkAuthorization from "../middlewares/checkAuthorization.js";
import addPostDetails from "../controller/appointment/addpostdetails.js";
import countAppointments from "../controller/appointment/count.js";
import getAppointmentById from "../controller/appointment/getById.js";
import getAppointmentsByStatus from "../controller/appointment/getByStatus.js";
import approveAppointment from "../controller/appointment/approve.js";
import deleteAppointmentById from "../controller/appointment/delete.js";
import getAppointmentsByUser from "../controller/appointment/getByUser.js";

const appointmentRouter = express.Router();

appointmentRouter.get(
  "/",
  checkAuthorization(["patient", "doctor", "admin"]),
  getAppointments
);

appointmentRouter.get(
  "/bystatus",
  checkAuthorization(["patient", "doctor", "admin"]),
  getAppointmentsByStatus
);

appointmentRouter.get(
  "/byuser",
  checkAuthorization(["patient", "doctor", "admin"]),
  getAppointmentsByUser
);

appointmentRouter.get(
  "/count",
  checkAuthorization(["patient", "doctor", "admin"]),
  countAppointments
);

appointmentRouter.post(
  "/create",
  checkAuthorization(["patient", "admin"]),
  createAppointment
);

appointmentRouter.patch(
  "/addpostdetails",
  checkAuthorization(["doctor"]),
  addPostDetails
);
appointmentRouter.patch(
  "/approve",
  checkAuthorization(["doctor", "admin"]),
  approveAppointment
);

// dynamic routes
appointmentRouter.get(
  "/:appointmentId",
  checkAuthorization(["patient", "doctor", "admin"]),
  getAppointmentById
);

appointmentRouter.delete(
  "/:appointmentId",
  checkAuthorization([ "doctor", "admin"]),
  deleteAppointmentById
);

export default appointmentRouter;
