import express from "express";
import DoctorSignUp from "../controller/doctor/signup.js";
import DoctorLogin from "../controller/doctor/login.js";
import AllDcotors from "../controller/doctor/getAll.js";
import dailySchedule from "../controller/doctor/dailySchedule.js";
import approveDoctor from "../controller/doctor/approve.js";
import getDoctorById from "../controller/doctor/getById.js";
import checkAuthorization from "../middlewares/checkAuthorization.js";
import editDoctor from "../controller/doctor/edit.js";
import getDoctorByCookie from "../controller/doctor/get.js";
import getDcotorsByStatus from "../controller/doctor/getByStatus.js";

const doctorRouter = express.Router();

doctorRouter.get(
  "/",
  checkAuthorization(["patient", "doctor", "admin"]),
  getDoctorByCookie
);
doctorRouter.get(
  "/all",
  checkAuthorization(["patient", "doctor", "admin"]),
  AllDcotors
);
doctorRouter.get(
  "/dailySchedule",
  checkAuthorization(["patient", "doctor", "admin"]),
  dailySchedule
);
doctorRouter.get(
  "/status",
  checkAuthorization(["patient", "doctor", "admin"]),
  getDcotorsByStatus
);

doctorRouter.post("/signup", DoctorSignUp);
doctorRouter.post("/login", DoctorLogin);

doctorRouter.patch("/", checkAuthorization(["doctor"]), editDoctor);
doctorRouter.patch("/approve", checkAuthorization(["admin"]), approveDoctor);

// dynamic routes
doctorRouter.get(
  "/:doctorId",
  checkAuthorization(["patient", "doctor", "admin"]),
  getDoctorById
);

export default doctorRouter;
