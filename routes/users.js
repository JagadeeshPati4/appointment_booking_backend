const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// get user baseb on token
router.get('/getUser', userController.getUser);

// Update a user (admin only)
router.put('/:id', authenticate, authorizeAdmin, userController.updateUser);

// Delete a user (admin only)
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);

module.exports = router;
