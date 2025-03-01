const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  const { username, password, isAdmin, phoneNumber, email,image } = req.body;
  console.log('image',image);

  try {
     // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
     if (existingUser) {
       return res.status(400).json({ message: 'Username or Email already exists' });
     }

    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      image = imageBuffer.toString('base64');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hashedPassword,
      isAdmin,
      phoneNumber,
      email,
      image
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered successfully', token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        image: user.image,
      },
     });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login successful', token ,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        image: user.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { username, password, isAdmin, phoneNumber, email } = req.body;
  let image = '';

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      image = imageBuffer.toString('base64');
      user.image = image;
    }

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    // Read the token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token found' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the extracted userId
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};