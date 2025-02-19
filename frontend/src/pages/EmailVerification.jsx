import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const VERIFY_URL = `${BASE_URL}/api/verify-email/`;

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setToken(e.target.value);
  };

  const handleVerify = async () => {
    if (!token) {
      setMessage("Please enter the token.");
      return;
    }

    try {
      const response = await fetch(`${VERIFY_URL}${token}/`, {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.detail || "Email verification failed.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Email Verification</h2>
        <input
          type="text"
          placeholder="Enter verification token"
          value={token}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Verify Email
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default EmailVerification;