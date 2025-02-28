const express = require('express');
const Order = require('../models/Order'); // Import the Order model
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount, shippingAddress } = req.body;

    // Validate required fields (excluding user)
    if (!products || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new order
    const newOrder = new Order({
      user, // Optional: Include if provided
      products,
      totalAmount,
      shippingAddress,
    });

    // Save the order to the database
    await newOrder.save();

    // Respond with the created order
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;