const router = require('express').Router();
const Product = require('../models/Product');

// 1. GET ALL PRODUCTS
// URL: GET http://localhost:5000/api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD A NEW PRODUCT
// URL: POST http://localhost:5000/api/products
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE A PRODUCT (Used for Edits, Restocking, and Sales)
// URL: PUT http://localhost:5000/api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Return the updated version
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. DELETE A PRODUCT
// URL: DELETE http://localhost:5000/api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;