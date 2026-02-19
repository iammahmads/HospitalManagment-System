import express from "express";
import PatientSignUp from "../controller/patient/signup.js";
import PatientLogin from "../controller/patient/login.js";
import getAllPatients from "../controller/patient/getAll.js";
import checkAuthorization from "../middlewares/checkAuthorization.js";
import getPatientById from "../controller/patient/getById.js";
import editPatient from "../controller/patient/edit.js";
import getPatientByCookie from "../controller/patient/get.js";

const patientRouter = express.Router();

patientRouter.get("/", checkAuthorization(["patient"]), getPatientByCookie);
patientRouter.get("/all", checkAuthorization(["doctor", "admin"]), getAllPatients);

patientRouter.post("/signup", PatientSignUp);
patientRouter.post("/login", PatientLogin);

patientRouter.patch("/", checkAuthorization(["patient"]), editPatient);

// dynamic rroutes
patientRouter.get(
  "/:patientId",
  checkAuthorization(["patient", "doctor", "admin"]),
  getPatientById
);

export default patientRouter;
