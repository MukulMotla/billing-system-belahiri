// Invoice.jsx
import React from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";

const Invoice = React.forwardRef(
  ({
    billItems,
    buyerName,
    buyerAddress,
    subtotal,
    gst,
    grandTotal,
    invoiceNumber,
    invoiceDate,
    companyName,
    companyLogo,
  }, ref) => (
    <Paper
      ref={ref}
      sx={{ p: 4, m: "auto", maxWidth: 800, border: "1px solid #ccc" }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <img src={companyLogo} alt="Logo" width={120} />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {companyName}
          </Typography>
          <Typography variant="body2">Invoice No: {invoiceNumber}</Typography>
          <Typography variant="body2">Date: {invoiceDate}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Buyer Info */}
      <Box sx={{ mb: 3, border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
        <Typography sx={{ fontWeight: "bold" }}>Bill To:</Typography>
        <Typography>{buyerName}</Typography>
        <Typography>{buyerAddress}</Typography>
      </Box>

      {/* Product Table */}
      <Table sx={{ mb: 2 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Price (₹)</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total (₹)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billItems.map((item, index) => (
            <TableRow
              key={index}
              sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price.toFixed(2)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Totals */}
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
        <Typography>GST (18%): ₹{gst.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Grand Total: ₹{grandTotal.toFixed(2)}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2">
          Thank you for your business!
        </Typography>
      </Box>
    </Paper>
  )
);

export default Invoice;
