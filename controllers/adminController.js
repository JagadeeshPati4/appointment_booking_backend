const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const fs = require('fs');

exports.addDoctor = async (req, res) => {
  console.log('req.body',req.body);
  const { name, workingHours, specialization } = req.body;
  let image = '';

  try {
    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      image = imageBuffer.toString('base64');
    }

    const doctor = new Doctor({
      name,
      workingHours,
      specialization,
      image
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateDoctor = async (req, res) => {
  const { name, workingHours, specialization } = req.body;
  let image = '';

  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      image = imageBuffer.toString('base64');
      doctor.image = image;
    }

    if (name) doctor.name = name;
    if (workingHours) doctor.workingHours = workingHours;
    if (specialization) doctor.specialization = specialization;

    await doctor.save();
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    console.log('req.params.id',req.params);
    const doctor = await Doctor.findById(req.params.id);
    console.log('doctor',doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.remove();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};