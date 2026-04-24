const express = require('express');
const { register, login, getMe, updateDetails, getAllUsers, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', getAllUsers);
router.put('/updatedetails', protect, updateDetails);
router.put('/user/:id', protect, authorize('admin'), updateDetails);
router.delete('/user/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
