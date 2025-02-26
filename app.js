const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const connectDB = require('./db');
const cors = require("cors");

require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(bodyParser.json());
// app.use(cors());

app.use(
  cors({
    origin:  process.env.ORIGIN, 
    credentials: true, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  })
);

app.use(cookieParser());

connectDB();

const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/doctors',upload.single('image'), doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users',upload.single('image'), userRoutes);
app.use('/admin',upload.single('image'), adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
