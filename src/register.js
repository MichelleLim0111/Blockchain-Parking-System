import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [eth_add, setEthAdd] = useState(''); // Changed email to eth_add
  const [username, setUsername] = useState('');
  const [isUsernameTaken, setIsUsernameTaken] = useState(false); // Track username availability
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false); // Track focus
  const navigate = useNavigate(); // Navigation hook

  const handleCheckboxChange = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check criteria
    setCriteria({
      length: newPassword.length >= 16,
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername.trim() === '') {
      setIsUsernameTaken(false);
      return;
    }

    try {
      const response = await fetch(`/check_user.php?username=${encodeURIComponent(newUsername)}`);
      const result = await response.json();
      setIsUsernameTaken(result.isTaken);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsUsernameTaken(false); // Assume it's not taken in case of error
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (isUsernameTaken) {
      alert('Username is already taken. Please choose another.');
      return;
    }

    try {
      const response = await fetch('/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          eth_add, // Changed from email
          username,
          password,
          confirmPassword,
        }),
      });

      const result = await response.text();

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed: ' + result);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <button
        type="button"
        className="return-button"
        onClick={() => navigate('/login')}
        aria-label="Return to Login"
      >
      <i className="fas fa-chevron-left" style={{ fontSize: '30px', color: '#fff' }}></i>
      </button>
      <h1>SB Parking System</h1>
      <h2>Registration</h2>
      <form className="Registration-form" onSubmit={handleRegister}>
        <div className="input-group">
          <label className="eth-label">Ethereum Account:</label>
          <input
            type="text"
            name="eth_add"
            value={eth_add} // Updated binding
            onChange={(e) => setEthAdd(e.target.value)} // Updated event handler
            placeholder="Enter Ethereum account address"
            required
            className="login-input"
          />
        </div>
        <div className="input-group">
          <label className="Username-label">Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter a username"
            required
            className="login-input"
          />
          {isUsernameTaken && <div className="error">Username is already taken</div>}
        </div>
        <div className="input-group">
          <label className="Password-label">Password:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            placeholder="Enter a password"
            required
            className="login-input"
          />
          {passwordFocused && (
            <div className="password-popup">
              <ul>
                <li className={criteria.length ? 'valid' : 'invalid'}>At least 16 characters</li>
                <li className={criteria.uppercase ? 'valid' : 'invalid'}>At least one uppercase letter</li>
                <li className={criteria.number ? 'valid' : 'invalid'}>At least one number</li>
                <li className={criteria.symbol ? 'valid' : 'invalid'}>At least one special symbol</li>
              </ul>
            </div>
          )}
        </div>
        <div className="input-group">
          <label className="Password-label">Confirm Password:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
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
        <button
          type="submit"
          className="register-button"
          disabled={
            !criteria.length ||
            !criteria.uppercase ||
            !criteria.number ||
            !criteria.symbol ||
            isUsernameTaken
          }
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
