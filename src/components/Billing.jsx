import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";

const Billing = () => {
  const companyName = "Your Company Name";

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [products] = useState([
    { name: "Paracetamol", price: 10 },
    { name: "Amoxicillin", price: 20 },
    { name: "Cough Syrup", price: 50 },
    { name: "Vitamin C", price: 15 },
    { name: "Ibuprofen", price: 12 },
    { name: "Antacid", price: 8 },
  ]);

  const [billItems, setBillItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const GST_RATE = 0.18;

  // Add product to bill
  const handleAddProduct = () => {
    if (!selectedProduct || !quantity) return;

    const price = customPrice ? Number(customPrice) : selectedProduct.price;

    const newItem = {
      name: selectedProduct.name,
      price,
      quantity: Number(quantity),
      total: price * Number(quantity),
    };

    setBillItems([...billItems, newItem]);
    setSelectedProduct(null);
    setCustomPrice("");
    setQuantity("");
  };

  // Remove product
  const handleRemoveProduct = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  // Edit product quantity or price directly
  const handleEditItem = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = Number(value);
    updatedItems[index].total = updatedItems[index].price * updatedItems[index].quantity;
    setBillItems(updatedItems);
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;

  // Printing
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${Date.now()}`,
  });

  return (
    <Box sx={{ maxWidth: 900, margin: "20px auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {companyName}
      </Typography>

      {/* Buyer Info */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buyer Name"
          variant="outlined"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Buyer Address"
          variant="outlined"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Product Selection */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Autocomplete
          options={products}
          getOptionLabel={(option) => `${option.name} (₹${option.price})`}
          value={selectedProduct}
          onChange={(event, newValue) => setSelectedProduct(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Product" />}
          sx={{ flex: 2 }}
        />

        <TextField
          label="Custom Price"
          type="number"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          sx={{ width: 120 }}
        />

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ width: 100 }}
        />

        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add
        </Button>
      </Box>

      {/* Editable Bill Table */}
      <Paper sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.price}
                    onChange={(e) => handleEditItem(index, "price", e.target.value)}
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleEditItem(index, "quantity", e.target.value)}
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell>₹{item.total.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProduct(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Invoice Component for Printing */}
      <Invoice
        ref={componentRef}
        billItems={billItems}
        buyerName={buyerName}
        buyerAddress={buyerAddress}
        subtotal={subtotal}
        gst={gst}
        grandTotal={grandTotal}
        companyName={companyName}
      />

      {/* Print Button */}
      <Button variant="contained" color="secondary" onClick={handlePrint} sx={{ mt: 2 }}>
        Print / Export Invoice
      </Button>
    </Box>
  );
};

export default Billing;
