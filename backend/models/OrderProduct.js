const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  name: String // Snapshot of product name at time of order
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderProduct', OrderProductSchema, 'orderProducts');
