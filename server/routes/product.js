const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../public/uploads");
    const fs = require("fs");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Add a new product
// routes/products.js
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, features } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];
      
    // Convert features to array if it's not already
    const featuresArray = Array.isArray(features) ? features : 
                         (features ? [features] : []);
    
    const product = new Product({ 
      name, 
      description, 
      price, 
      images,
      features: featuresArray 
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Edit a product
// In PUT endpoint:
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, features } = req.body;
    const existingImages = Array.isArray(req.body.existingImages) 
      ? req.body.existingImages
      : req.body.existingImages 
        ? [req.body.existingImages]
        : [];

    const newImagePaths = req.files 
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const updateData = { 
      name, 
      description, 
      price,
      images: [...existingImages, ...newImagePaths],
      features: Array.isArray(features) ? features : [features].filter(Boolean)
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
