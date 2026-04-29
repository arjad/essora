const express = require('express');
const { createOrder, getUserOrders, getOrders, updateOrder, deleteOrder, syncIncompleteOrder, getOrderById, cancelOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/sync-incomplete')
  .post(syncIncompleteOrder);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id')
  .get(getOrderById)
  .put(protect, authorize('admin'), updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

router.route('/user/:userId')
  .get(getUserOrders);

module.exports = router;
