const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  brand: {
    type: String,
    default: 'Essora'
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  onSale: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
