import express from "express";
import createNotification from "../controller/notification/create.js";
import getNotifications from "../controller/notification/get.js";
import getNotificationById from "../controller/notification/byId.js";

const notificationRouter = express.Router();

notificationRouter.get("/", getNotifications);

notificationRouter.post("/", createNotification);

// dynamic routes
notificationRouter.get("/:notificationId", getNotificationById);

export default notificationRouter;
