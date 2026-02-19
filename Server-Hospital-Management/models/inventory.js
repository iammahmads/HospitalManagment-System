import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
bloodGroup: { type: String, required: true, unique: true },
units: { type: Number, default: 0 }
});


export const Inventory  = mongoose.model('Inventory', InventorySchema);