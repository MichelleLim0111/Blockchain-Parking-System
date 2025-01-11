import React, { useState } from 'react';
import './App.css'; // Include appropriate styles for the CAPTCHA component

const CaptchaGenerator = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track verification state

  // Function to generate a random math CAPTCHA
  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`, // Math question
      answer: num1 + num2, // Correct answer
    };
  }

  // Handle the verification process
  const handleVerify = () => {
    if (parseInt(userInput, 10) === captcha.answer) {
      setIsVerified(true);
      setError('');
      onVerify(true); // Notify parent component of successful verification
    } else {
      setIsVerified(false);
      setError('Incorrect CAPTCHA. Please try again.');
      setCaptcha(generateCaptcha()); // Generate a new CAPTCHA on failure
      setUserInput(''); // Clear input field
      onVerify(false); // Notify parent component of failure
    }
  };

  return (
    <div className="captcha-container">
      <p>Solve the CAPTCHA to continue:</p>
      <div className="captcha-question">
        <strong>{captcha.question}</strong> {/* Display the CAPTCHA question */}
      </div>
      <input
        type="text"
        placeholder="Answer"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="captcha-input"
        disabled={isVerified} // Disable input if CAPTCHA is verified
      />
      <button
        type="button"
        onClick={handleVerify}
        className={`captcha-verify-button ${isVerified ? 'verified' : ''}`}
        disabled={isVerified} // Disable button if CAPTCHA is verified
      >
        {isVerified ? 'Verified' : 'Verify'}
      </button>
      {error && <p className="captcha-error">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default CaptchaGenerator;
