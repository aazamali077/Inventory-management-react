const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  id: String,
  platform: String,
  quantity: Number,
  date: String,
  timestamp: String
});

const ProductSchema = new mongoose.Schema({
  // We don't need 'id' here, MongoDB creates a unique '_id' automatically
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, default: 'Other' },
  price: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  restockQuantity: { type: Number, default: 50 },
  sales: [SaleSchema], // Stores a list of sales history
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);