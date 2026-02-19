import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  field: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  fee: {type: Number, default: 0, reqiured: true},
  status: {
    type: String,
    required: true,
    enum: ["approved", "pending"],
  },
  maxAppointments: {
    type: Number,
    required: true,
  },
  appointmentHours: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
  schedule: {
    type: [
      {
        day: {
          type: {
            start: {
              type: Number,
              required: true,
            },
            end: {
              type: Number,
              required: true,
            },
          },
        },

        currentAppointments: {
          type: Number,
          required: true,
        },

        appointedHours: {
          type: [Number],
          required: true,
        },
      },
    ],
  },
  about: {
    type: String,
    required: true,
  },
  verification: {
    type: {
      code: {
        type: String,
      },
      generatedAt: {
        type: String,
      },
    },
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

export const DoctorModel = new mongoose.model("doctor", DoctorSchema);
