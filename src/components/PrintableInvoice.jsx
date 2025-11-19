// PrintableInvoice.jsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const PrintableInvoice = ({
  companyName, companyPhone, companyAddress,
  invoiceDate, invoiceNo,
  buyerName, buyerPhone, buyerAddress,
  billItems, subtotal, gstAmount, grandTotal, gstPercent
}) => {
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, color: "#000" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Typography variant="h5" component="div" style={{ fontWeight: 700 }}>{companyName}</Typography>
          <div>Phone: {companyPhone}</div>
          <div>{companyAddress}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div><strong>Invoice No:</strong> {invoiceNo}</div>
          <div><strong>Date:</strong> {invoiceDate}</div>
        </div>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div style={{ marginBottom: 10 }}>
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>Bill To:</Typography>
        <div>Name: {buyerName || "-"}</div>
        <div>Phone: {buyerPhone || "-"}</div>
        <div>Address: {buyerAddress || "-"}</div>
      </div>

      <Table size="small" style={{ borderCollapse: "collapse", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ border: "1px solid #444", fontWeight: 700 }}>#</TableCell>
            <TableCell style={{ border: "1px solid #444", fontWeight: 700 }}>Product</TableCell>
            <TableCell style={{ border: "1px solid #444", fontWeight: 700, textAlign: "right" }}>Price (₹)</TableCell>
            <TableCell style={{ border: "1px solid #444", fontWeight: 700, textAlign: "right" }}>Qty</TableCell>
            <TableCell style={{ border: "1px solid #444", fontWeight: 700, textAlign: "right" }}>Total (₹)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billItems.map((it, idx) => (
            <TableRow key={idx}>
              <TableCell style={{ border: "1px solid #444" }}>{idx + 1}</TableCell>
              <TableCell style={{ border: "1px solid #444" }}>{it.name}</TableCell>
              <TableCell style={{ border: "1px solid #444", textAlign: "right" }}>{it.price.toFixed(2)}</TableCell>
              <TableCell style={{ border: "1px solid #444", textAlign: "right" }}>{it.quantity}</TableCell>
              <TableCell style={{ border: "1px solid #444", textAlign: "right" }}>{it.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <div style={{ minWidth: 260 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Subtotal</div>
            <div>₹{subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>GST ({gstPercent}% ) - CGST</div>
            <div>₹{cgst.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>GST ({gstPercent}% ) - SGST</div>
            <div>₹{sgst.toFixed(2)}</div>
          </div>

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
            <div>Grand Total</div>
            <div>₹{grandTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 12 }}>
        <div>Declaration: This is a computer generated invoice and does not require signature.</div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
