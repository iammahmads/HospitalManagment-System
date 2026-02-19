import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  salt: {
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
  hash: {
    type: String,
    required: true,
  },
  doctorIds: {
    type: [String],
  },
});

export const PatientModel = new mongoose.model("patient", PatientSchema);
