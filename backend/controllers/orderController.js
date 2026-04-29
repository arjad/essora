const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');

// @desc    Get all orders for a user
// @route   GET /api/orders/user/:userId
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.params.userId,
      status: { $ne: 'incomplete' } // Exclude abandoned carts
    }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName name');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    console.log(`[Orders] Creating main order for user: ${req.body.user}`);
    
    // Set estimated delivery date (9 days from now)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 9);
    req.body.estimatedDeliveryDate = estimatedDate;
    req.body.status = 'pending'; // Ensure status is set to pending

    // Check if an incomplete order exists for this user and "convert" it, or create new
    let order = await Order.findOne({ user: req.body.user, status: 'incomplete' });
    
    if (order) {
      console.log(`[Orders] Converting incomplete order ${order._id} to pending.`);
      Object.assign(order, req.body);
      await order.save();
    } else {
      order = await Order.create(req.body);
    }

    if (req.body.items && Array.isArray(req.body.items)) {
      console.log(`[Orders] Found ${req.body.items.length} items. Syncing to bridge table...`);
      const bridgeEntries = req.body.items.map(item => ({
        order: order._id,
        product: item.id || item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));
      
      const saved = await OrderProduct.insertMany(bridgeEntries);
      console.log(`[Orders] Bridge table sync successful. ${saved.length} entries created.`);
    } else {
      console.warn('[Orders] No items found in request body to sync to bridge table.');
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error(`[Orders] Error in createOrder: ${err.message}`);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'user',
      select: 'firstName lastName name email'
    }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // 1. If items are updated, refresh the bridge table
    if (req.body.items && Array.isArray(req.body.items)) {
      console.log(`[Orders] Refreshing bridge table for order: ${order._id}`);
      await OrderProduct.deleteMany({ order: order._id });
      
      const bridgeEntries = req.body.items
        .filter(item => (item.id || item.product))
        .map(item => ({
          order: order._id,
          product: item.id || item.product,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        }));

      if (bridgeEntries.length > 0) {
        const saved = await OrderProduct.insertMany(bridgeEntries);
        console.log(`[Orders] Updated bridge table with ${saved.length} entries.`);
      } else {
        console.warn(`[Orders] No valid items with product IDs found for order: ${order._id}`);
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Sync incomplete order (Abandoned Cart)
// @route   POST /api/orders/sync-incomplete
exports.syncIncompleteOrder = async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;
    if (!user) return res.status(400).json({ success: false, error: 'User ID is required' });

    // Find existing incomplete order for this user
    let order = await Order.findOne({ user, status: 'incomplete' });
    
    if (order) {
      order.items = items;
      order.totalAmount = totalAmount;
      await order.save();
      console.log(`[Orders] Updated incomplete order for user: ${user}`);
    } else {
      order = await Order.create({
        user,
        items,
        totalAmount,
        status: 'incomplete'
      });
      console.log(`[Orders] Created new incomplete order for user: ${user}`);
    }
    
    // Update bridge table for accurate tracking
    if (items && Array.isArray(items)) {
      await OrderProduct.deleteMany({ order: order._id });
      const bridgeEntries = items.map(item => ({
        order: order._id,
        product: item.product || item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));
      await OrderProduct.insertMany(bridgeEntries);
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error(`[Orders] Sync incomplete error: ${err.message}`);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    
    // Check if status allows cancellation
    const restrictedStatuses = ['shipped', 'out for delivery', 'delivered'];
    if (restrictedStatuses.includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Cancellation failed. Your order is already ${order.status} and cannot be stopped now.` 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    console.log(`[Orders] Order ${order._id} cancelled by user.`);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    // 1. Remove entries from Bridge Table first
    await OrderProduct.deleteMany({ order: req.params.id });

    // 2. Remove the main Order
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
