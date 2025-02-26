const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const moment = require('moment');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      }
    });

    const start = moment(date);
    const end = moment(date).add(duration, 'minutes');
    const isAvailable = !appointments.some(appointment => {
      const appointmentStart = moment(appointment.date);
      const appointmentEnd = moment(appointment.date).add(appointment.duration, 'minutes');
      return start < appointmentEnd && end > appointmentStart;
    });

    if (!isAvailable) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    const appointment = new Appointment({
      doctorId,
      date,
      duration,
      appointmentType,
      patientName,
      notes
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      }
    });

    const start = moment(date);
    const end = moment(date).add(duration, 'minutes');
    const isAvailable = !appointments.some(existingAppointment => {
      if (existingAppointment.id === appointment.id) return false;
      const appointmentStart = moment(existingAppointment.date);
      const appointmentEnd = moment(existingAppointment.date).add(existingAppointment.duration, 'minutes');
      return start < appointmentEnd && end > appointmentStart;
    });

    if (!isAvailable) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    appointment.doctorId = doctorId;
    appointment.date = date;
    appointment.duration = duration;
    appointment.appointmentType = appointmentType;
    appointment.patientName = patientName;
    appointment.notes = notes;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.remove();
    res.json({ message: 'Appointment canceled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};