import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // for navigation
import "./App.css"; // Import the specific CSS file

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/header.php');
        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            setUsername(data.username);
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        navigate('/login');
      }
    };

    fetchSession();
  }, [navigate]);

  // Extract totalCost, selectedSlot, and duration from location state
  const { totalCost, selectedSlot, duration } = location.state || {}; 

  const [PrivateKey, setPrivateKey] = useState("");

  const handlePayment = () => {
    if (PrivateKey.trim() === "") {
      alert("Please enter your private key.");
      return;
    }

    // Confirm payment with the user
    if (
      window.confirm(
        `Are you sure you want to proceed with the private key:\n\n${PrivateKey}`
      )
    ) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    // Retrieve the access code from the latest booking in localStorage
    const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));


    const accessCode = bookingDetails.accessCode;

    alert("Your payment has been processed!");
    alert(`Below is a one-time access code generated for you to access your parking spot.
      DO NOT SHARE THIS CODE WITH ANYONE!
      Access Code: ${accessCode}`);

    // Generate new booking object using the selectedSlot
    const newBooking = {
      id: Date.now(), // Unique ID for the booking
      details: `Duration: ${duration}`, 
      slot: `Slot: ${selectedSlot}`, // Use the selected slot
      date: new Date().toLocaleDateString(), // Current date
      price: `ETH ${totalCost}`, // Total cost passed
      favorite: false, // Default favorite status
    };

    // Save the new booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem("upcomingBookings")) || [];
    localStorage.setItem("upcomingBookings", JSON.stringify([...existingBookings, newBooking]));

    // Navigate to the Homepage
    navigate("/Homepage");
  };

  return (
    <div className="payment-container">
      {/* Back Button */}
      <button
        className="back-button-payment"
        onClick={() => navigate("/Confirmation")} // Navigate to the previous page
      >
        <i
          className="fas fa-chevron-left"
          style={{ fontSize: "30px", color: "#6a0dad" }}
        ></i>
      </button>

      {/* Step Indicator */}
      <div className="top-section">
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
        <h2 className="step-text">Step 3 of 3: Complete Your Payment</h2>
        <p className="description">
          Please confirm your total cost and proceed by entering your private key.
        </p>
      </div>

      {/* Total Cost Card */}
      <div className="card">
        <h3 className="card-title">Total Cost</h3>
        <p className="card-amount">ETH {totalCost}</p>
      </div>

      {/* Selected Slot */}
      <div className="card">
        <h3 className="card-title">Selected Slot</h3>
        <p className="card-amount">{selectedSlot || "No slot selected"}</p>
      </div>

      {/* Wallet Address Input */}
      <div className="input-section">
        <label className="label">Enter your Private Key</label>
        <input
          type="text"
          className="input"
          placeholder="Enter Your Private Key"
          value={PrivateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </div>

      {/* Pay Button */}
      <button className="pay-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
