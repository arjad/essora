const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ready to ship', 'shipped', 'out for delivery', 'delivered'],
    default: 'pending'
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  paymentScreenshot: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
