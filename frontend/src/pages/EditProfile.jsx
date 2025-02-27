
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { GetContent } from "../services/GetContent";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]; // Ensure file exists
    if (!file) {
      console.warn("No file selected!");
      return;
    }

    const objectURL = URL.createObjectURL(file);
    setPreviewImage(objectURL); // Preview image
    setFormData((prevData) => ({
      ...prevData,
      photo: file, // Update to match 'photo' instead of 'profileImage'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formDataToSend = new FormData();
    if (formData.username) formDataToSend.append("username", formData.username);
    if (formData.bio) formDataToSend.append("bio", formData.bio);
    if (formData.photo) formDataToSend.append("photo", formData.photo);
  
    try {
      const token = GetContent.getAuthToken();  // Get the auth token from localStorage
  
      if (!token) {
        toast.error("You are not authenticated. Please log in again.");
        setLoading(false);
        return;
      }
  
      const response = await fetch(`http://103.206.101.254:8015/api/profile/update/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/profile"), 1500);  // Navigate to profile page
      } else {
        throw new Error(data.detail || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Edit Profile</h2>

        {previewImage && (
          <div className="flex justify-center mb-4">
            <img src={previewImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

