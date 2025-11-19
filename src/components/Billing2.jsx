// Billing2.jsx
import React, { useState, useMemo } from "react";
import {
  Box, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Divider, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import PrintableInvoice from "./PrintableInvoice";

const INITIAL_PRODUCTS = [
  { name: "GDCOLD-PDS", price: 80.00 },
  { name: "GEDFLOX-MS", price: 82.00 },
  { name: "MONTANKID-L", price: 85.50 },
  { name: "GDMF-P", price: 82.00 },
  { name: "GDCOUGH-DX", price: 115.00 },
  { name: "GDCOUGH-LS", price: 132.00 },
  { name: "FERROSE-XT", price: 165.00 },
  { name: "GASEDRAFT", price: 175.50 },
  { name: "HEALTHVIT", price: 215.00 },
  { name: "HUNGRYCYP", price: 142.00 },
  { name: "CALBON-D3", price: 125.00 },
  { name: "GESTROKIND", price: 99.00 },
  { name: "MEGLOCID", price: 105.00 },
  { name: "GDCOLD-DROPS", price: 125.00 },
  { name: "BONCARE-D3", price: 280.00 },
  { name: "GEODZYME", price: 135.00 },

  // Capsules
  { name: "PANKIND-DSR", price: 120.00 },
  { name: "REBKIND-DSR", price: 109.00 },
  { name: "ITROCON-200", price: 248.00 },

  // Tablets
  { name: "DICLOKIND-P", price: 47.95 },
  { name: "ASAIRA-SP", price: 105.00 },
  { name: "GDMOL-650", price: 22.40 },
  { name: "ACIKIND-P", price: 65.00 },
  { name: "LEMONET-M", price: 110.00 },
  { name: "Livocet-5", price: 32.00 },
];


const Billing2 = () => {
  // Company info (you can make these editable later)
  const companyName = "Belahiri Healthcare Pvt Ltd";
  const companyPhone = "+91-8860670794";
  const companyAddress = "Sector-10, A-30, Noida, Uttar Pradesh";

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  const [products] = useState(INITIAL_PRODUCTS);
  const [billItems, setBillItems] = useState([]);

  // autocomplete can be freeSolo (allow custom product name)
  const [selectedProduct, setSelectedProduct] = useState(null); // can be object or string
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  // GST percent (total). Example 5 means 5% (2.5% CGST + 2.5% SGST)
  const [gstPercent, setGstPercent] = useState(5);

  // Invoice no generation
  const invoiceNo = useMemo(() => {
    const t = Date.now().toString().slice(-6); // last 6 digits timestamp
    const rand = Math.floor(Math.random() * 900 + 100); // 3 digit random
    return `BH/${new Date().getFullYear()}/${t}${rand}`;
  }, []); // generated once per mount

  // Calculations
  const subtotal = billItems.reduce((s, it) => s + it.total, 0);
  const gstAmount = +(subtotal * (gstPercent / 100));
  const grandTotal = subtotal + gstAmount;

  // Add product (handles both existing option objects and free text custom product)
  const addProduct = () => {
    if (!selectedProduct && !customPrice) return;

    const name = typeof selectedProduct === "string"
      ? selectedProduct
      : selectedProduct?.name;

    if (!name) return;

    // price precedence: customPrice field > selected product price > 0
    const price = customPrice ? Number(customPrice) : (selectedProduct && selectedProduct.price ? Number(selectedProduct.price) : 0);

    if (!price || !quantity || quantity <= 0) {
      alert("Enter valid price and quantity.");
      return;
    }

    const item = {
      name,
      price,
      quantity: Number(quantity),
      total: Number((price * Number(quantity)).toFixed(2))
    };

    setBillItems(prev => [...prev, item]);

    // reset inputs
    setSelectedProduct(null);
    setCustomPrice("");
    setQuantity(1);
  };

  const removeItem = (index) => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    // Build simple HTML for printing
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; color: #000; padding: 20px; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; }
        table{ width:100%; border-collapse: collapse; margin-top:12px; }
        table th, table td{ border: 1px solid #444; padding: 8px; text-align: left; }
        .right{ text-align: right; }
        .totals{ width:100%; display:flex; justify-content:flex-end; margin-top:12px; }
        .totals div{ min-width:260px; }
      </style>
    `;

    const itemsHtml = billItems.map((it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.name}</td>
        <td class="right">${it.price.toFixed(2)}</td>
        <td class="right">${it.quantity}</td>
        <td class="right">${it.total.toFixed(2)}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head>
          <title>Invoice ${invoiceNo}</title>
          ${styles}
        </head>
        <body>
          <div class="header">
            <div>
              <h2>${companyName}</h2>
              <div>Phone: ${companyPhone}</div>
              <div>${companyAddress}</div>
            </div>
            <div style="text-align:right;">
              <div><strong>Invoice No:</strong> ${invoiceNo}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <hr />

          <div>
            <strong>Bill To:</strong>
            <div>${buyerName || "-"}</div>
            <div>${buyerPhone || "-"}</div>
            <div>${buyerAddress || "-"}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th class="right">Price (₹)</th>
                <th class="right">Qty</th>
                <th class="right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div>
              <div style="display:flex;justify-content:space-between;"><div>Subtotal</div><div>₹${subtotal.toFixed(2)}</div></div>
              <div style="display:flex;justify-content:space-between;"><div>GST (${gstPercent}%) - CGST</div><div>₹${(gstAmount/2).toFixed(2)}</div></div>
              <div style="display:flex;justify-content:space-between;"><div>GST (${gstPercent}%) - SGST</div><div>₹${(gstAmount/2).toFixed(2)}</div></div>
              <hr />
              <div style="display:flex;justify-content:space-between;font-weight:700;"><div>Grand Total</div><div>₹${grandTotal.toFixed(2)}</div></div>
            </div>
          </div>

          <div style="margin-top:20px;font-size:12px;">
            Declaration: This is a computer generated invoice and does not require signature.
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "width=900,height=700");
    w.document.open();
    w.document.write(html);
    w.document.close();
    // give the browser a small moment before print
    setTimeout(() => {
      w.print();
      // don't auto-close — some users prefer to save as PDF themselves
      // w.close();
    }, 300);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "20px auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>{companyName}</Typography>
      <Typography variant="subtitle2" align="center">{companyAddress} • Phone: {companyPhone}</Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1">Buyer Details</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField fullWidth label="Buyer Name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            <TextField fullWidth label="Buyer Phone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} />
            <TextField fullWidth label="Buyer Address" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Invoice</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            <TextField label="Invoice No" value={invoiceNo} InputProps={{ readOnly: true }} />
            <TextField label="Date" value={new Date().toLocaleDateString()} InputProps={{ readOnly: true }} />
            <TextField
              label="GST %"
              type="number"
              value={gstPercent}
              onChange={(e) => setGstPercent(Number(e.target.value || 0))}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <Autocomplete
          freeSolo
          options={products}
          getOptionLabel={(opt) => typeof opt === "string" ? opt : `${opt.name} (₹${opt.price})`}
          value={selectedProduct}
          onChange={(e, v) => setSelectedProduct(v)}
          onInputChange={(e, newValue, reason) => {
            if (reason === "input") setSelectedProduct(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Select or type product (free text allowed)" />}
          sx={{ flex: 2 }}
        />

        <TextField
          label="Price (₹)"
          type="number"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          sx={{ width: 120 }}
          helperText="Override price (optional)"
        />

        <TextField
          label="Qty"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ width: 100 }}
        />

        <Button variant="contained" onClick={addProduct}>Add</Button>
      </Box>

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price (₹)</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Total (₹)</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems.map((it, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{it.name}</TableCell>
                <TableCell align="right">{it.price.toFixed(2)}</TableCell>
                <TableCell align="right">{it.quantity}</TableCell>
                <TableCell align="right">{it.total.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => removeItem(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {billItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No items added yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Box>
          <Button variant="outlined" onClick={() => {
            // quick clear
            if (window.confirm("Clear all bill items?")) setBillItems([]);
          }}>Clear Items</Button>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <div>Subtotal: <strong>₹{subtotal.toFixed(2)}</strong></div>
          <div>GST ({gstPercent}%): <strong>₹{gstAmount.toFixed(2)}</strong></div>
          <div style={{ fontSize: 18, marginTop: 6 }}>Grand Total: <strong>₹{grandTotal.toFixed(2)}</strong></div>
          <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="contained" color="secondary" onClick={handlePrint}>Print / Export</Button>
          </Box>
        </Box>
      </Box>

      {/* Hidden preview using PrintableInvoice component (optional) */}
      <div style={{ display: "none" }}>
        <PrintableInvoice
          companyName={companyName}
          companyPhone={companyPhone}
          companyAddress={companyAddress}
          invoiceDate={new Date().toLocaleDateString()}
          invoiceNo={invoiceNo}
          buyerName={buyerName}
          buyerPhone={buyerPhone}
          buyerAddress={buyerAddress}
          billItems={billItems}
          subtotal={subtotal}
          gstAmount={gstAmount}
          grandTotal={grandTotal}
          gstPercent={gstPercent}
        />
      </div>
    </Box>
  );
};

export default Billing2;
