import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the profile-specific CSS

export default function Profile() {
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout.php', {
        method: 'POST', // Assuming you're using POST for logout requests
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.clear();
        navigate('/login'); // Redirect to login page
      } else {
        alert('Error logging out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="profile-container">
        <button onClick={() => navigate(-1)} className="profile-back-button">
          <i className="fas fa-chevron-left" style={{ fontSize: '30px' }}></i>
        </button>
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-row">
          {/* Profile Picture and Welcome Text */}
          <div className="profile-info">
            <img
              src="https://avatars.worldcubeassociation.org/uploads/user/avatar/2017JUND01/1675305209.jpeg"
              alt="Profile"
              className="profile-picture"
            />
            <div>
              <p className="welcome-text">Welcome</p>
              <p className="name-text">{username}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="logout-button"
            onClick={handleLogout} // Replace with actual logout logic
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {/* White Overlapping Section */}
      <div className="white-section">
        {/* Navigation Options */}
        <div className="nav-item" onClick={() => navigate('/profile')}>
          <i className="fas fa-user"></i>
          <span className="nav-text">Profile</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="nav-item">
          <i className="fas fa-credit-card"></i>
          <span className="nav-text">Balance</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="nav-item">
          <i className="fas fa-file-alt"></i>
          <span className="nav-text">Terms & Conditions</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="nav-item">
          <i className="fas fa-question-circle"></i>
          <span className="nav-text">FAQ</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="nav-item">
          <i className="fas fa-cogs"></i>
          <span className="nav-text">Settings</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        {/* Help Button */}
        <div className="help-button">
          <i className="fas fa-headset"></i>
          <span className="help-text">How can we help you?</span>
        </div>
      </div>
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
}
