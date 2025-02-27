import React, { useState } from "react";

const ResendVerificationButton = ({ email }) => {
  const [userEmail, setUserEmail] = useState(email || ""); // Allow manual input if email is missing
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!userEmail) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/resend-verification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error resending verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {!email && ( // Show input if email is not provided
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full"
        />
      )}
      <button
        onClick={handleResend}
        disabled={loading}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>
      {message && <p className="text-sm mt-2 text-white">{message}</p>}
    </div>
  );
};

export default ResendVerificationButton;
