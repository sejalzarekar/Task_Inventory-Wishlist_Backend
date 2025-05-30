const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let wishlist = []; // In-memory wishlist

// 🔐 Auth Middleware (inline)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// ➕ Add product to wishlist (Protected)
router.post('/', authenticate, (req, res) => {
  const item = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    userId: req.user.id,
  };
  wishlist.push(item);
  res.status(201).json(item);
});

// 📥 Get all wishlist items for the logged-in user (Protected)
router.get('/', authenticate, (req, res) => {
  const userWishlist = wishlist.filter((item) => item.userId === req.user.id);
  res.json(userWishlist);
});

// 🗑️ Remove item from wishlist (Protected)
router.delete('/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  wishlist = wishlist.filter((item) => item.id !== id || item.userId !== req.user.id);
  res.json({ message: 'Item removed from wishlist' });
});

module.exports = router;
