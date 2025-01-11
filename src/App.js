import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './login.js'; // Import the Login component
import Register from './register.js'; // Import the Register component
import Homepage from './homepage.js';
import Profile from './profile.js';
import Notification from './notification.js';
import Booking from './booking.js';
import Parking from './parking.js';
import Confirmation from './confirmation_page.js';
import Payment from './payment.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/homepage" element={<Homepage />} />
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/notification" element={<Notification />} />
        <Route path = "/booking" element={<Booking />} />
        <Route path = "/parking" element={<Parking />} />
        <Route path = "/confirmation" element={<Confirmation />} />
        <Route path = "/payment" element={<Payment />} />

      </Routes>
    </Router>
  );
};

export default App;
