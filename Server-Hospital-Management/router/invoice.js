import { Router } from "express";
import { Invoice } from "../models/invoice.js";

const InvoiceRouter = Router()


InvoiceRouter.get("/:appointment", async (req, res) => {
    try {
        const { appointment } = req.params;
        console.log(appointment)

        // Fetch invoice and populate doctor and patient info
        const invoice = await Invoice.findOne({ appointment })
            .populate("doctor", "name field fee")
            .populate("patient", "name email cnic");

        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        res.json(invoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch invoice" });
    }
});

export default InvoiceRouter