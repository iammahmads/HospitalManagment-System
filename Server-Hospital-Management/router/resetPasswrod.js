import express from "express";
import sendCode from "../controller/resetPassword/sendCode.js";
import verifyCode from "../controller/resetPassword/verifyCode.js";

const resetPasswordRouter = express.Router();

resetPasswordRouter.post("/", sendCode);
resetPasswordRouter.post("/verify", verifyCode);

export default resetPasswordRouter;
