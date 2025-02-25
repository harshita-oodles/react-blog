import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [stayLoggedIn, setStayLoggedIn] = useState(true); // ✅ Default: Stay logged in
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setStayLoggedIn(!stayLoggedIn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage("");
    setError("");
    setLoading(true);

    // Retrieve token correctly
    const storedToken = localStorage.getItem("authToken");
    const token = storedToken ? JSON.parse(storedToken).access : null;

    if (!token) {
        setError("You are not logged in. Please log in again.");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch("http://103.206.101.254:8015/api/change-password/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Something went wrong.");
        }

        setMessage(data.message || "Password changed successfully!");
        setFormData({ old_password: "", new_password: "", confirm_password: "" });

        //If "Stay Logged In" is unchecked, logout & redirect to login
        if (!stayLoggedIn) {
            localStorage.removeItem("authToken");
            setTimeout(() => navigate("/login"), 2000); // Redirect to login
        } else {
            setTimeout(() => navigate("/profile"), 2000);
        }

    } catch (error) {
        setError(error.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🔒 Change Password</h2>

        {/* Success & Error Messages */}
        {message && (
          <p className="text-green-700 bg-green-100 border border-green-500 p-3 rounded-lg mb-4 text-sm">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-700 bg-red-100 border border-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Old Password</label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Stay Logged In Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="stayLoggedIn"
              checked={stayLoggedIn}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="stayLoggedIn" className="ml-2 text-sm text-gray-800">
              Stay Logged In
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition active:scale-95 shadow-md"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
