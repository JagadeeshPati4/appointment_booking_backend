const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// GET /appointments - Retrieve all appointments
router.get('/', appointmentController.getAllAppointments);

// GET /appointments/:id - Retrieve details for a specific appointment
router.get('/:id', appointmentController.getAppointmentById);

// GET /appointments/:id - Retrieve details for a specific appointment by user id
router.get('/user/:userId', appointmentController.getAppointmentsByUserId);

// POST /appointments - Create a new appointment
router.post('/createAppointment', appointmentController.createAppointment);

// PUT /appointments/:id - Update an existing appointment
router.put('/updateAppointment/:id', appointmentController.updateAppointment);

// DELETE /appointments/:id - Cancel an appointment
router.delete('/deleteAppointment/:id', appointmentController.deleteAppointment);

module.exports = router;
