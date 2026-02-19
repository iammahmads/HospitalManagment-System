import { Router } from "express";
import { BloodRequest } from "../models/bloodRequest.js";
import checkAuthorization from "../middlewares/checkAuthorization.js";

const BloodRequestRoute = Router();


// Create a new blood request
BloodRequestRoute.post('/', checkAuthorization(["patient"]), async (req, res) => {
    try {
        const id = req.id;
        const { bloodGroup, units = 1, notes } = req.body;
        const reqDoc = await BloodRequest.create({ bloodGroup, units, notes, patient: id });
        res.status(201).json(reqDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create request' });
    }
});


// Public: list requests (optionally filter by status)
BloodRequestRoute.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const list = await BloodRequest.find(query).sort({ createdAt: -1 }).populate("patient", "_id name email cnic");
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});


export default BloodRequestRoute