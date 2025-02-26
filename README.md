# Prenatal Care Appointment Booking System

This is a prenatal care appointment booking system built with Node.js, Express, and MongoDB. The system allows users to register, login, and book appointments with doctors. Admins can manage doctors and view all appointments.

## Features

- User registration and login
- Book, update, and cancel appointments
- View available appointment slots for doctors
- Admin functionalities to add, update, and delete doctors
- JWT-based authentication and authorization
- Image upload for user and doctor profiles

## Project Structure

## Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd <repository-directory>


DATABASE_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>


Start the server:
npm run start
or for development:

npm run dev

API Endpoints


Users
POST /users/register - Register a new user
POST /users/login - Login a user
PUT /users/:id - Update a user (admin only)
DELETE /users/:id - Delete a user (admin only)
Doctors
GET /doctors - Retrieve all doctors
GET /doctors/:id - Retrieve details for a specific doctor
GET /doctors/:id/slots - Retrieve available slots for a specific doctor
Appointments
GET /appointments - Retrieve all appointments
GET /appointments/:id - Retrieve details for a specific appointment
POST /appointments/createAppointment - Create a new appointment
PUT /appointments/updateAppointment/:id - Update an existing appointment
DELETE /appointments/deleteAppointment/:id - Cancel an appointment


Admin
POST /admin/doctors/create - Add a new doctor (admin only)
PUT /admin/doctors/update/:id - Update a doctor (admin only)
DELETE /admin/doctors/delete/:id - Delete a doctor (admin only)
GET /admin/appointments - Get all appointments (admin only)
Middleware
authenticate - Middleware to authenticate users using JWT
authorizeAdmin - Middleware to authorize admin users
Models
User - User model
Doctor - Doctor model
Appointment - Appointment model
License
This project is licensed under the ISC License.