import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './App.css'; // Import the notification-specific CSS

export default function Notification() {
    const [username, setUsername] = useState(null);
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

  // Sample data for notifications
  const todayNotifications = [
    { id: '1', title: 'Order Successful', message: 'Congrats on your reserved parking space...', time: '12:34' },
    { id: '2', title: 'Order Successful', message: 'Congrats on your reserved parking space...', time: '12:34' },
  ];

  const yesterdayNotifications = [
    { id: '3', title: 'Payment Received', message: 'Your payment was processed successfully.', time: '10:15' },
    { id: '4', title: 'Order Confirmed', message: 'Your order has been confirmed.', time: '14:20' },
  ];

  const earlierNotifications = [
    { id: '5', title: 'Order Successful', message: 'Congrats on your reserved parking space...', time: '12:34' },
    { id: '6', title: 'Payment Received', message: 'Your payment was processed successfully.', time: '14:50' },
  ];

  // Render notification cards
  const renderNotificationCard = (notification) => (
    <div key={notification.id} className="notification-card">
      <div className="notification-card-content">
        <div className="notification-indicator"></div>
        <div className="notification-text-container">
          <h3 className="notification-card-title">{notification.title}</h3>
          <p className="notification-card-message">{notification.message}</p>
        </div>
        <span className="notification-card-time">{notification.time}</span>
      </div>
    </div>
  );

  return (
    <div className="notification-container">
      {/* Header */}
      <div className="notification-header">
        <button onClick={() => navigate(-1)} className="notification-back-button">
          <i className="fas fa-chevron-left" style={{ fontSize: '30px', color: '#000' }}></i>
        </button>
        <h1 className="notification-title">Notification</h1>
      </div>

      {/* Scrollable Content */}
      <div className="notification-scroll-content">
        {/* Today Section */}
        <div className="notification-section">
          <h2 className="notification-section-title">Today</h2>
          <div className="notification-list-content">
            {todayNotifications.map(renderNotificationCard)}
          </div>
        </div>

        {/* Yesterday Section */}
        <div className="notification-section">
          <h2 className="notification-section-title">Yesterday</h2>
          <div className="notification-list-content">
            {yesterdayNotifications.map(renderNotificationCard)}
          </div>
        </div>

        {/* Earlier Section */}
        <div className="notification-section">
          <h2 className="notification-section-title">23 October 2024</h2>
          <div className="notification-list-content">
            {earlierNotifications.map(renderNotificationCard)}
          </div>
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
