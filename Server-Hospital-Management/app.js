import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import validateToken from "./controller/validateToken.js";
import patientRouter from "./router/patient.js";
import doctorRouter from "./router/doctor.js";
import adminRouter from "./router/admin.js";
import appointmentRouter from "./router/appointment.js";
import notificationRouter from "./router/notification.js";
import checkAuthorization from "./middlewares/checkAuthorization.js";
import resetPasswordRouter from "./router/resetPasswrod.js";
import Login from "./controller/login.js";
import BloodRequestRoute from "./router/bloodRequest.js";
import InvoiceRouter from "./router/invoice.js";

const app = express();

// dotenv config
config();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

dbConnection();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/login", Login);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);
app.use("/appointment", appointmentRouter);
app.use("/reset", resetPasswordRouter);
app.use(
  "/notification",
  checkAuthorization(["patient", "admin", "doctor"]),
  notificationRouter
);
app.use("/requests", BloodRequestRoute)
app.use("/invoices", InvoiceRouter)
app.use("/validateToken", validateToken); // use it to protected routes
// app.use("*", (_, res) => res.json({ message: "invalid route" }));

export default app;
