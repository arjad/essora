const express = require('express');
const { registerComplaint, getUserComplaints } = require('../controllers/complaintController');

const router = express.Router();

router.route('/')
  .post(registerComplaint);

router.route('/user/:userId')
  .get(getUserComplaints);

module.exports = router;
