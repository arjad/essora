const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    console.log("gettu=ing status")
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
