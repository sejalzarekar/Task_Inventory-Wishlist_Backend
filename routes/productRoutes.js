const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory product list
let products = [];

// 🔐 Auth Middleware Inline
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user data from token
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// ➕ Add a new product (Protected)
router.post('/', authenticate, (req, res) => {
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 📥 Get all products (Public)
router.get('/', (req, res) => {
  res.json(products);
});

// 🗑️ Delete a product by ID (Protected)
router.delete('/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.json({ message: 'Product deleted successfully' });
});

// 📝 Update a product by ID (Protected)
router.put('/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = {
    ...products[productIndex],
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
  };

  products[productIndex] = updatedProduct;

  res.json(updatedProduct);
});




module.exports = router;
