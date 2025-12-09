const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products'); // Import Routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Routes Middleware
app.use('/api/products', productRoutes); // Use Routes

// Basic Route
app.get('/', (req, res) => {
  res.send('Inventory Server is Running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});