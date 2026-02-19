import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    fromId: {
      type: String,
      required: true,
    },
    toId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dated: {
      type: Number,
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    viewedBy: {
      type: {
        doctor: {
          type: Boolean,
        },
        admin: {
          type: Boolean,
        },
        patient: {
          type: Boolean,
        },
      },
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const NotificatiionModel = new mongoose.model(
  "notification",
  NotificationSchema
);
