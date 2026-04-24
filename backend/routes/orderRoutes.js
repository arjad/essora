const express = require('express');
const { createOrder, getUserOrders, getOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/user/:userId')
  .get(getUserOrders);

module.exports = router;
