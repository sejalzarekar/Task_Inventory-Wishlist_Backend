const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('/public'));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

// DB Connection
const connectDB = require('./config/db');
connectDB();



// Start server
const HOST = '127.0.0.1';
const PORT = process.env.PORT || 5000;

app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));
