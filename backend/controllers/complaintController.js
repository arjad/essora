const Complaint = require('../models/Complaint');

// @desc    Register a new complaint
// @route   POST /api/complaints
exports.registerComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user complaints
// @route   GET /api/complaints/user/:userId
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId }).sort('-createdAt');
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
