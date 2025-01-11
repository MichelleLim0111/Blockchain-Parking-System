import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const scrollViewRef = useRef(null);
  const tabs = ["Past", "Upcoming", "Favorites"];
  const navigate = useNavigate();

  // State for bookings
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [favoritesBookings, setFavoritesBookings] = useState([]);

  // Load saved bookings from localStorage on component mount
  useEffect(() => {
    const savedBooking = JSON.parse(localStorage.getItem("bookingDetails"));
    if (savedBooking) {
      const booking = {
        id: 1, // You can set a unique ID or derive it dynamically
        location: `Slot: ${savedBooking.parkingPlace}`,
        details: `Time: ${savedBooking.startTime}:00 - ${savedBooking.endTime}:00`,
        date: savedBooking.date,
        price: `Access Code: ${savedBooking.accessCode}`,
        refund: `${savedBooking.totalCost} ETH`,
        favorite: false,
      };
      setUpcomingBookings([booking]);
    }
  }, []);

  // Function to cancel/delete a booking with confirmation and private key prompt
  const handleDeleteBooking = (id) => {
    const bookingToDelete = upcomingBookings.find((booking) => booking.id === id);

    if (!bookingToDelete) return;

    // Prompt for the private key
    const userPrivateKey = window.prompt(
      "Please enter your private key to confirm the cancellation:"
    );

    if (!userPrivateKey) {
      alert("Cancellation aborted: Private key is required.");
      return;
    }

    // Confirm cancellation and process refund
    const userConfirmed = window.confirm(
      `Are you sure you want to delete this booking?\nAmount refunded: ${bookingToDelete.refund}`
    );

    if (userConfirmed) {
      const updatedUpcoming = upcomingBookings.filter((booking) => booking.id !== id);
      setUpcomingBookings(updatedUpcoming);
      localStorage.clear();
      alert(`Booking deleted successfully. Amount refunded: ${bookingToDelete.refund}`);
    }
  };

  // Toggle favorite bookings
  const toggleFavorite = (id, type) => {
    let updatedFavorites;

    const updateFavoriteStatus = (bookings) =>
      bookings.map((booking) => {
        if (booking.id === id) {
          const updatedBooking = { ...booking, favorite: !booking.favorite };

          if (updatedBooking.favorite) {
            updatedFavorites = [...favoritesBookings, updatedBooking];
          } else {
            updatedFavorites = favoritesBookings.filter((fav) => fav.id !== id);
          }

          return updatedBooking;
        }
        return booking;
      });

    if (type === "upcoming") {
      const updatedBookings = updateFavoriteStatus(upcomingBookings);
      setUpcomingBookings(updatedBookings);
    } else if (type === "past") {
      const updatedBookings = updateFavoriteStatus(pastBookings);
      setPastBookings(updatedBookings);
    } else if (type === "favorites") {
      updatedFavorites = favoritesBookings.filter((fav) => fav.id !== id);
      setFavoritesBookings(updatedFavorites);
    }

    setFavoritesBookings(updatedFavorites || favoritesBookings);
  };

  const renderBookingItem = (item, type) => (
    <div className="booking-card" key={item.id}>
      <div className="booking-header">
        <span className="booking-location-text">{item.location}</span>
        <button
          className="booking-favorite-button"
          onClick={() => toggleFavorite(item.id, type)}
        >
          <span className={item.favorite ? "heart-icon filled" : "heart-icon"}></span>
        </button>
      </div>
      <div className="booking-details">
        <p className="booking-details-text">Details: {item.details}</p>
        <p className="booking-details-text">Date: {item.date}</p>
        <p className="booking-details-text">Price: {item.price}</p>
        <p className="booking-details-text">Refundable: {item.refund}</p>
      </div>
      <div className="booking-actions">
        <button
          className="booking-cancel-text"
          onClick={() => handleDeleteBooking(item.id)}
        >
          Delete Booking
        </button>
        <button className="booking-reschedule-button">Reschedule Booking</button>
      </div>
    </div>
  );

  const renderContent = (data, type) => (
    <div className="booking-content-list">
      {data.length > 0 ? (
        data.map((item) => renderBookingItem(item, type))
      ) : (
        <p>No {type} bookings available.</p>
      )}
    </div>
  );

  const handleTabPress = (index) => {
    setSelectedTab(tabs[index]);
    scrollViewRef.current.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });
  };

  const handleSwipe = (event) => {
    const index = Math.round(event.target.scrollLeft / window.innerWidth);
    setSelectedTab(tabs[index]);
  };

  return (
    <div className="booking-container">
        <button onClick={() => navigate(-1)} className="booking-back-button">
          <i className="fas fa-chevron-left" style={{ fontSize: '30px', color: '#000' }}></i>
        </button>
      <h1 className="booking-title">Your Bookings</h1>
      <div className="booking-tab-container">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => handleTabPress(index)}
            className={`booking-tab ${selectedTab === tab ? "booking-active-tab" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className="booking-tabs-content"
        ref={scrollViewRef}
        onScroll={handleSwipe}
        style={{ display: "flex", overflowX: "auto", paddingTop: "20px" }}
      >
        <div style={{ minWidth: "100%" }}>{renderContent(pastBookings, "past")}</div>
        <div style={{ minWidth: "100%" }}>{renderContent(upcomingBookings, "upcoming")}</div>
        <div style={{ minWidth: "100%" }}>{renderContent(favoritesBookings, "favorites")}</div>
      </div>
      <div className="homepage__bottom-nav">
        <div onClick={() => navigate("/homepage")} className="homepage__nav-item">
          <i className="fas fa-home"></i>
          <p>Home</p>
        </div>
        <div onClick={() => navigate("/notification")} className="homepage__nav-item">
          <i className="fas fa-bell"></i>
          <p>Notifications</p>
        </div>
        <div onClick={() => navigate("/booking")} className="homepage__nav-item">
          <i className="fas fa-calendar"></i>
          <p>Booking</p>
        </div>
        <div onClick={() => navigate("/profile")} className="homepage__nav-item">
          <i className="fas fa-user"></i>
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
}
