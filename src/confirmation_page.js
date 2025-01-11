import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css"; // Import the specific CSS file

const ConfirmationPage = () => {
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
  // Assuming route parameters are passed via `state`
  const { parkingPlace, duration, totalCost } = location.state || {};

  return (
    <div className="confirmation-container">
      {/* Top Section with Progress Indicator */}
      <div className="confirmation-top-section">
        {/* Back Arrow */}
        <button
          className="back-button"
          onClick={() => navigate('/parking')}
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '30px', color: '#6a0dad' }}></i>
        </button>
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
        <h2 className="step-text">Step 2 of 3: Confirm Reservation</h2>
        <p className="description">
          Review your reservation details before proceeding to payment.
        </p>
      </div>

      {/* Reservation Summary */}
      <div className="summary-card">
        <h3 className="summary-title">Reservation Summary</h3>
        <div className="summary-row">
          <span className="label">Parking Place:</span>
          <span className="value">{parkingPlace}</span>
        </div>
        <div className="summary-row">
          <span className="label">Duration:</span>
          <span className="value">{duration} h</span>
        </div>
        <div className="summary-row">
          <span className="label">Hourly Rate:</span>
          <span className="value">eth 0.01/h</span>
        </div>
        <div className="summary-row">
          <span className="label">Total Cost:</span>
          <span className="value">eth {totalCost}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        className="pay-button"
        onClick={() =>
          navigate("/payment", {
            state: { 
              totalCost,     // Pass total cost
              selectedSlot: parkingPlace, // Pass parking place as slot
              duration,       // Pass duration
            },
          })
        }
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default ConfirmationPage;
