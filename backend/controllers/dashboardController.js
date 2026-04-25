const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const orders = await Order.find().populate('user', 'firstName lastName name');
    
    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    
    // Get latest 5 orders for activity feed
    const latestOrders = await Order.find()
      .populate('user', 'firstName lastName name email')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalSales,
        latestOrders
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
