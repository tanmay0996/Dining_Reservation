# Hotel Dining Reservation System 🍽️

## Overview 📋

This is a MERN stack project designed to _manage hotel table bookings efficiently_. The application has separate functionalities for users and managers, with Stripe payment integration for seamless transactions.

## Features 🌟

**Manager Registration:** Managers can register and manage their hotels.

**Hotel Management:** Managers can add hotels and manage table bookings.

**User Registration:** Users can register and book tables.

**Table Booking:** Users can book tables for a specific slot in any hotel, restricted to the current day.

**Payment Integration:** _Stripe_ integration ensures secure and reliable payment processing.

## Technologies Used 🛠️

**Frontend:** React.js 🌐

**Backend:** Node.js with Express.js ⚙️

**Database:** MongoDB 🗃️

**Payment Gateway:** Stripe 💳

## Project Structure 📁

```hotel-dining-reservation-system
|-- server
|   |-- client
|       |-- public
|       |--src
|           |-- components
|           |-- images
|           |-- App.css
|           |-- App.js
|           |-- index.css
|           |-- index.js
|           |-- UserContext.js
|   |-- config
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- uploads
|   |-- utils
|   |-- server.js
|   |-- stripe.js
|-- README.md
```

## Usage 📝

**Manager Functionality:**

1.  Register as a manager.

2.  Add a hotel to the system.

3.  Manage table bookings for the hotel.

**User Functionality:**

1.  Register as a user.

2.  View available hotels and book tables for a specific time slot.

3.  Complete the payment using Stripe.

## Stripe Payment Integration 💳

Stripe is used for secure payment transactions during the booking process.

## OTP Verification System 🔑

**User & Manager OTP Verification:**

- OTP verification is implemented during **signup** to verify email authenticity.
- **Forgot Password OTP Verification:** Users and managers must verify an OTP before resetting their passwords.
- OTPs are sent via email and expire in **5 minutes** for security.

## Deployment 🚀

The project is deployed and accessible at: [https://hotel-dining-reservation-system.onrender.com/](https://hotel-dining-reservation-system.onrender.com/)

The server takes almost a minute to start.

## Contact 📞

For queries or feedback, please contact the project owner at [1663ankesh@gmail.com](1663ankesh@gmail.com).
