const express = require('express');
const router = express.Router();
const { createProduct, getProducts, deleteProduct, updateProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

// Get all products
router.get('/', getProducts);

// Create a new product (protected)
router.post('/', auth, createProduct);

// Update a product (protected)
router.put('/:id', auth, updateProduct);

// Delete a product (protected)
router.delete('/:id', auth, deleteProduct);

module.exports = router;
