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
    enum: ['incomplete', 'pending', 'ready to ship', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: function() { return this.status !== 'incomplete'; }
  },
  city: {
    type: String,
    required: function() { return this.status !== 'incomplete'; }
  },
  state: {
    type: String,
    required: function() { return this.status !== 'incomplete'; }
  },
  country: {
    type: String,
    required: function() { return this.status !== 'incomplete'; }
  },
  phone: {
    type: String,
    required: function() { return this.status !== 'incomplete'; }
  },
  paymentScreenshot: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  estimatedDeliveryDate: {
    type: Date
  },
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
