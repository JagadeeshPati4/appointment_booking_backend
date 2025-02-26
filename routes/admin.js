const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Add a new doctor (admin only)
router.post('/doctors/create', authenticate, authorizeAdmin, adminController.addDoctor);

router.put('/doctors/update/:id', authenticate, authorizeAdmin,adminController.updateDoctor);
router.delete('/doctors/delete/:id',authenticate, authorizeAdmin, adminController.deleteDoctor);

// Get all appointments (admin only)
router.get('/appointments', authenticate, authorizeAdmin, adminController.getAllAppointments);

module.exports = router;
