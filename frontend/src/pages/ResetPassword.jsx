import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import Link here
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!otp || !newPassword) {
      toast.error("Please fill in both fields.");
      setIsLoading(false);
      return;
    }
  
    console.log("Sending data:", { otp, new_password: newPassword, token });
  
    try {
      const response = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, new_password: newPassword, token }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Your password has been reset successfully.");
        navigate("/login");
      } else {
        toast.error(data.detail || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("There was an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[80vh] lg:py-0">
          <div className="w-full bg-primary-neutral rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Reset Your Password
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="otp" className="block mb-2 text-sm font-medium">
                    OTP
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP"
                    className="bg-primary-base shadow-lg sm:text-sm rounded-lg focus:ring-primary block w-full p-2.5 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block mb-2 text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-primary-base shadow-lg sm:text-sm rounded-lg focus:ring-primary block w-full p-2.5 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-sm text-center font-light text-white dark:text-white">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-teal-600 hover:underline dark:text-teal-500"
                >
                  Go back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
