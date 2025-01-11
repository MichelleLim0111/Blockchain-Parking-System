import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./App.css";

const ParkingPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availability, setAvailability] = useState(Array(10).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const dayAfterNext = new Date(today);
  dayAfterNext.setDate(today.getDate() + 2);

  const formatDate = (date) => date.toISOString().split("T")[0];

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

  const fetchAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select date, start time, and end time first.");
      return;
    }

    const requestData = {
      date: selectedDate,
      start_time: `${startTime}:00`,
      end_time: `${endTime}:00`,
    };

    try {
      const response = await fetch("/check_availability.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
        setAvailability(data.availability);
      } else {
        alert(data.error || "Error checking availability.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error checking availability.");
    }
  };

  const handleSlotSelection = (index) => {
    if (availability[index]) setSelectedSlot(index);
  };

  const handleBooking = () => {
    if (!selectedDate || !startTime || !endTime || selectedSlot === null) {
      alert("Please fill out all fields and select a slot.");
      return;
    }

    const generateAccessCode = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return code;
    };

    const duration = parseInt(endTime) - parseInt(startTime);
    const totalCost = duration * 0.01;
    const accessCode = generateAccessCode();

    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        parkingPlace: `Slot ${selectedSlot}`,
        duration,
        totalCost: totalCost.toFixed(2),
        date: selectedDate,
        accessCode,
        startTime,
        endTime,
      })
    );

    navigate("/confirmation", {
      state: {
        parkingPlace: `Slot ${selectedSlot}`,
        duration,
        totalCost: totalCost.toFixed(2),
      },
    });
  };

  const generateHourOptions = () => {
    const options = [];
    for (let hour = 10; hour <= 22; hour++) {
      options.push(
        <option key={hour} value={hour}>
          {`${hour}:00`}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="parking-container">
      <button
        className="return-button"
        onClick={() => navigate("/homepage")}
        aria-label="Return to Home"
      >
        <i className="fas fa-chevron-left" style={{ fontSize: "30px" }}></i>
      </button>
      <h1>Book Your Parking Slot</h1>
      <div className="parking-form">
        <label>
          Select Date:
          <input
            type="date"
            min={formatDate(today)}
            max={formatDate(dayAfterNext)}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
            <option value="">Select Start Time</option>
            {generateHourOptions()}
          </select>
        </label>
        <label>
          End Time:
          <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
            <option value="">Select End Time</option>
            {generateHourOptions()}
          </select>
        </label>
        <button className="check-availability-button" onClick={fetchAvailability}>
          Check Availability
        </button>
        <div className="parking-slots">
          {availability.map((isAvailable, index) => (
            <button
              key={index}
              className={`slot-button ${
                isAvailable === null
                  ? "uninitialized"
                  : isAvailable
                  ? "available"
                  : "unavailable"
              } ${selectedSlot === index ? "selected" : ""}`}
              onClick={() => handleSlotSelection(index)}
              disabled={!isAvailable}
            >
              Slot {index}
            </button>
          ))}
        </div>
        <button className="book-button" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ParkingPage;
