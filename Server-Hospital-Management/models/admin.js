import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
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

export const AdminModel = new mongoose.model("admin", AdminSchema);
