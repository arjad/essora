const express = require('express');
const { getUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), (req, res, next) => {
    console.log('GET /users route hit');
    next();
  }, getUsers);

router.route('/:id')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);


module.exports = router;
