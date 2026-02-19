import mongoose, { Types } from "mongoose";

const BloodRequestSchema = new mongoose.Schema({
    bloodGroup: { type: String, required: true },
    units: { type: Number, default: 1 },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'fulfilled', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    patient: { type: Types.ObjectId, ref: "patient", required: true }
});


export const BloodRequest = mongoose.model('BloodRequest', BloodRequestSchema);