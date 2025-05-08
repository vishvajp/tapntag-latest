const mongoose = require('mongoose');

// models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }], // Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
