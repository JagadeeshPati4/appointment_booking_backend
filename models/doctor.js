const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  // Optional additional fields
  specialization: { type: String },
  image: { type: String } // New field for image URL
});

module.exports = mongoose.model('Doctor', doctorSchema);
