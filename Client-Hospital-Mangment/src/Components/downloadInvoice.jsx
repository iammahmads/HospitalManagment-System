import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { BACKEND_URL } from "../services";

export default function DownloadInvoicePDF({ appointmentId }) {
    const [loading, setLoading] = useState(false);

    const downloadPDF = async () => {
        setLoading(true);

        try {
            // 1. Fetch invoice data from API
            const res = await fetch(`${BACKEND_URL}/invoices/${appointmentId}`, {
                method: "GET",
                credentials: "include"
            })
            const response = await res.json()
            const invoice = response;

            const doc = new jsPDF();

            // 2. Add Logo (optional: replace URL with your logo base64 or URL)
            // doc.addImage(logoDataURL, 'PNG', 15, 10, 40, 20);

            doc.setFontSize(18);
            doc.text("Invoice (HMS)", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.text(`Invoice ID: ${invoice._id}`, 20, 40);
            doc.text(`Patient: ${invoice.patient.name}`, 20, 50);
            doc.text(`Patient Cnic: ${invoice.patient.cnic}`, 20, 60);
            doc.text(`Doctor: ${invoice.doctor.name} (${invoice.doctor.field})`, 20, 70);
            doc.text(`Appointment ID: ${invoice.appointment}`, 20, 80);
            doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 90);

            // 3. Table-like breakdown
            const startY = 110; // start below header info
            doc.setFontSize(14);
            doc.text("Charges", 20, startY - 10); // text just above table

            const tableData = [
                ["Description", "Amount (Pkr)"],
                ["Subtotal", invoice.subtotal.toFixed(2)],
                ["GST (15%)", invoice.gst.toFixed(2)],
                ["Total", invoice.total.toFixed(2)],
            ];

            let y = startY;
            tableData.forEach((row, i) => {
                doc.text(row[0], 20, y);
                doc.text(row[1], 150, y, { align: "right" });
                if (i === 0) {
                    y += 2;
                    doc.setLineWidth(0.5).line(20, y, 170, y); // underline header
                }
                y += 10;
            });


            // 4. Footer
            doc.setFontSize(10);
            doc.text("Thank you for using our service!", 105, y + 20, { align: "center" });

            // 5. Save PDF
            doc.save(`invoice_${invoice._id}.pdf`);
        } catch (err) {
            console.error("Failed to generate invoice PDF:", err);
            alert("Failed to download invoice. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={downloadPDF}
            disabled={loading}
            className={`bg-green-600 text-white p-2 rounded hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
        >
            {loading ? "Generating PDF..." : "Download Invoice PDF"}
        </button>
    );
}
