import express from "express";
import AdminSignUp from "../controller/admin/signup.js";
import AdminLogin from "../controller/admin/login.js";
import getAdminById from "../controller/admin/getById.js";
import checkAuthorization from "../middlewares/checkAuthorization.js";
import getAllAdmins from "../controller/admin/getAll.js";
import editAdmin from "../controller/admin/edit.js";
import getAdminByCookie from "../controller/admin/get.js";
import { BloodRequest } from "../models/bloodRequest.js";
import { Inventory } from "../models/inventory.js"


const adminRouter = express.Router();

// dynamic routes
adminRouter.get('/requests', async (req, res) => {
    const list = await BloodRequest.find().sort({ createdAt: -1 });
    return res.json(list);
});
adminRouter.get("/all", checkAuthorization(["admin"]), getAllAdmins);
// Get inventory
adminRouter.get('/inventory', async (req, res) => {
    const items = await Inventory.find();
    return res.json(items);
});
adminRouter.get("/:adminId", checkAuthorization(["admin"]), getAdminById);
adminRouter.get("/", checkAuthorization(["admin"]), getAdminByCookie);

adminRouter.post("/signup", AdminSignUp);
adminRouter.post("/login", AdminLogin);
adminRouter.post('/inventory', async (req, res) => {
    try {
        const { bloodGroup, units } = req.body;
        let inv = await Inventory.findOne({ bloodGroup });
        if (!inv) inv = await Inventory.create({ bloodGroup, units });
        else inv.units = (inv.units || 0) + Number(units);
        await inv.save();
        return res.json(inv);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update inventory' });
    }
});


// Update request status (e.g., fulfill/reject). When fulfilling, optionally deduct units
adminRouter.put('/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const reqDoc = await BloodRequest.findById(id);
        if (!reqDoc) return res.status(404).json({ error: 'Request not found' });


        // if fulfilling, deduct from inventory
        if (status === 'fulfilled') {
            let inv = await Inventory.findOne({ bloodGroup: reqDoc.bloodGroup });
            if (!inv) {
                inv = await Inventory.create({
                    bloodGroup: reqDoc.bloodGroup,
                    units: 0
                })
            }
            const deduct = reqDoc.units || 1;
            // if (inv.units < deduct) return res.status(400).json({ error: 'Not enough inventory to fulfill' });
            inv.units += deduct;
            await inv.save();
        }


        reqDoc.status = status;
        await reqDoc.save();
        return res.json(reqDoc);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Failed to update request' });
    }
});
adminRouter.put('/inventory/:bloodGroup', async (req, res) => {
    try {
        const { bloodGroup } = req.params;
        const { units } = req.body; // can be negative
        const inv = await Inventory.findOneAndUpdate(
            { bloodGroup },
            { $inc: { units: Number(units) } },
            { new: true } // return updated document
        );
        if (!inv) return res.status(404).json({ error: "Blood group not found" });
        return res.json(inv);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Failed to adjust inventory' });
    }
});
adminRouter.put("/", checkAuthorization(["admin"]), editAdmin);



export default adminRouter;
