const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String } // New field for image URL
});

module.exports = mongoose.model('User', userSchema);
