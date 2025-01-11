import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [username, setUsername] = useState(null);
  const [accAdd, setAccAdd] = useState(null);
  const [balance, setBalance] = useState('Loading...'); // State for balance
  const [bookingDetails, setBookingDetails] = useState(null); // State for booking details
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/fetch_balance.php');
        if (response.ok) {
          const data = await response.json();
          setAccAdd(data.eth_add); // Set the Ethereum address
          setBalance(`${data.balance}`); // Set the balance
        } else {
          setBalance('Error retrieving balance');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('Error retrieving balance');
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const savedBooking = JSON.parse(localStorage.getItem("bookingDetails"));
    if (savedBooking) {
      setBookingDetails(savedBooking);
    }
  }, []);

  return (
    <div className="homepage">
      {/* Top Section */}
      <div className="homepage__top-section">
        <div className="homepage__search-icon-container">
          <i className="fas fa-search homepage__search-icon"></i>
        </div>
        <div className="homepage__welcome-user">
          {username && <p>Welcome, <strong>{username}</strong>!</p>}
        </div>
        <div className="homepage__balance-card-container">
          <div className="homepage__balance-card">
            <h3>Balance</h3>
            <p>{balance}</p> {/* Dynamically display the balance */}
          </div>
        </div>
      </div>

      {/* White Section */}
      <div className="homepage__lower-section">
        {/* Parking Section */}
        <h2>Parking</h2>
        <p className="homepage__recommendations">Recommendations for you</p>
        <div className="homepage__parking-grid">
          <div
            className="homepage__parking-card"
            style={{ backgroundColor: '#e76f51', borderTopRightRadius: '20px' }}
            onClick={() => navigate('/parking')}
          >
            Parking
          </div>
          <div
            className="homepage__parking-card"
            style={{ backgroundColor: '#f4a261', borderTopLeftRadius: '20px' }}
            onClick={() => navigate('/profile')}
          >
            Profile
          </div>
        </div>

        {/* Reservation Section */}
        <h2>Your Reservation</h2>
        {bookingDetails ? (
          <div className="homepage__reservation-card">
            <p>Date: {bookingDetails.date}</p>
            <p>Start Time: {bookingDetails.startTime}:00</p>
            <p>End Time: {bookingDetails.endTime}:00</p>
            <p>Slot: {bookingDetails.parkingPlace}</p>
            <p>Access Code: {bookingDetails.accessCode}</p>
          </div>
        ) : (
          <p>No reservations available.</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="homepage__bottom-nav">
        <div onClick={() => navigate('/homepage')} className="homepage__nav-item">
          <i className="fas fa-home"></i>
          <p>Home</p>
        </div>
        <div onClick={() => navigate('/notification')} className="homepage__nav-item">
          <i className="fas fa-bell"></i>
          <p>Notifications</p>
        </div>
        <div onClick={() => navigate('/booking')} className="homepage__nav-item">
          <i className="fas fa-calendar"></i>
          <p>Booking</p>
        </div>
        <div onClick={() => navigate('/profile')} className="homepage__nav-item">
          <i className="fas fa-user"></i>
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
