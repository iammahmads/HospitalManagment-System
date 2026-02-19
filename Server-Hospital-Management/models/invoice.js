import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "appointmnet", required: true, unique: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "patient", required: true },

    // breakdown
    fee: { type: Number, required: true },        // doctor fee (total)
    subtotal: { type: Number, required: true },   // fee excluding GST
    gst: { type: Number, required: true },        // GST amount
    total: { type: Number, required: true },      // subtotal + gst

    createdAt: { type: Date, default: Date.now }
});

export const Invoice = new mongoose.model("invoice", InvoiceSchema);
