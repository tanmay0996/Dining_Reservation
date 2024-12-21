# Hotel Table Booking Management System

## Overview

This is a MERN stack project designed to *manage hotel table bookings efficiently*. The application has separate functionalities for users and managers, with Stripe payment integration for seamless transactions.


## Features

**Manager Registration:** Managers can register and manage their hotels.

**Hotel Management:** Managers can add hotels and manage table bookings.

**User Registration:** Users can register and book tables.

**Table Booking:** Users can book tables for a specific slot in any hotel, restricted to the current day.

**Payment Integration:** *Stripe* integration ensures secure and reliable payment processing.


## Technologies Used

**Frontend:** React.js

**Backend:** Node.js with Express.js

**Database:** MongoDB

**Payment Gateway:** Stripe


## Project Structure

hotel-dining-reservation-system
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
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- uploads
|   |-- utils
|   |-- server.js
|   |-- stripe.js
|-- README.md


## Usage

**Manager Functionality:**

1.  Register as a manager.

2.  Add a hotel to the system.

3.  Manage table bookings for the hotel.

**User Functionality:**

1.  Register as a user.

2.  View available hotels and book tables for a specific time slot.

3.  Complete the payment using Stripe.


## Stripe Payment Integration

Stripe is used for secure payment transactions during the booking process. 


## Deployment

The project is deployed and accessible at: [https://hotel-dining-reservation-system.onrender.com/](https://hotel-dining-reservation-system.onrender.com/)

## Contact

For queries or feedback, please contact the project owner at [1663ankesh@gmail.com](1663ankesh@gmail.com).

