import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorField: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    dated: {
      type: Number,
      required: true,
    },
    hoursTime: {
      type: Number,
      required: true,
    },
    timePassed: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "scheduled", "completed", "deleted"],
    },
    details: {
      pre: {
        type: String,
      },
      post: {
        type: String,
      },
      postDetailsWritten: {
        type: Boolean,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const AppointmentModel = new mongoose.model(
  "appointmnet",
  AppointmentSchema
);
