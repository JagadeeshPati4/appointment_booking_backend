const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const moment = require('moment');
const fs = require('fs');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      }
    });

    const workingHours = doctor.workingHours;
    const start = moment(date + ' ' + workingHours.start);
    const end = moment(date + ' ' + workingHours.end);
    const slots = [];

    while (start < end) {
      const slotEnd = moment(start).add(30, 'minutes');
      const isAvailable = !appointments.some(appointment => {
        const appointmentStart = moment(appointment.date);
        const appointmentEnd = moment(appointment.date).add(appointment.duration, 'minutes');
        return start < appointmentEnd && slotEnd > appointmentStart;
      });

      if (isAvailable) {
        slots.push(start.format('HH:mm'));
      }

      start.add(30, 'minutes');
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

