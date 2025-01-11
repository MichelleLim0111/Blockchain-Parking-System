import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptchaGenerator from './captcha'; // Import the updated CAPTCHA component
import './App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false); // Track CAPTCHA status
  const navigate = useNavigate();

  const handleCheckboxChange = () => { 
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      alert('Please complete the CAPTCHA before logging in.');
      return;
    }

    try {
      const response = await fetch('/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        navigate('/homepage');
      } else {
        const errorText = await response.text();
        alert(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h1>SB Parking System</h1>
      <h2>Welcome back!</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label className="Username-label">Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="input-group">
          <label className="Password-label">Password:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="show-password"
            checked={passwordVisible}
            onChange={handleCheckboxChange}
            className="checkbox-input"
          />
          <label htmlFor="show-password" className="checkbox-label">
            Show Password
          </label>
        </div>
        <CaptchaGenerator onVerify={setCaptchaVerified} /> {/* Updated CAPTCHA */}
        <div className="register">
          <p>
            <Link to="/register">Don't have an account?</Link>
          </p>
        </div>
        <button type="submit" className="login-button" disabled={!captchaVerified}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
