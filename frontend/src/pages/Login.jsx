import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Login = () => {
  const { userLogin, errMessage, resendVerificationEmail } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // Track resend state

  const location = useLocation();
  const { message } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state

    try {
      const response = await userLogin(username, password);

      console.log("Login Response:", response); // ✅ Debugging response

      // Check for errors
      if (response?.error === "No active account found with the given credentials") {
        setShowPopup(true);  // Show the resend verification popup
        toast.error("Your account is not active. Please check your inbox for a verification email.");
      } else if (response?.error === "email_not_verified") {
        setShowPopup(true);  // Show resend verification popup for email verification
        toast.error("Your email is not verified. Please check your inbox.");
      } else {
        setShowPopup(false); // Hide the popup if login is successful
        toast.success("Login successful!");
      }

      setLoading(false);  // Reset loading state
    } catch (error) {
      setLoading(false);  // Reset loading state
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }, [message]);

  const handleResendVerification = async () => {
    setResending(true);  // Set resending state
    
    try {
      const response = await resendVerificationEmail(username); // Pass username instead of email
      
      console.log("Resend Verification Response:", response); // ✅ Debugging response
    
      if (response?.status === 200) {
        // Show success toast with a green popup
        toast.success("Verification email resent successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",  // Ensure this is light theme, which uses green for success
        });
      } else {
        toast.error(response?.message || "Failed to resend verification email.");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred while resending verification email.");
    } finally {
      setResending(false);  // Reset resending state
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />

      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[80vh] lg:py-0">
          <div className="w-full bg-primary-neutral rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Sign in to your account
              </h1>
              {errMessage && <p className="text-red-500 text-sm">{errMessage}</p>}

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="bg-primary-base shadow-lg sm:text-sm rounded-lg focus:ring-primary block w-full p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="bg-primary-base shadow-lg sm:text-sm rounded-lg focus:ring-primary block w-full p-2.5 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  disabled={loading}  // Disable button while loading
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <p className="text-sm text-center font-light text-white">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="font-medium text-teal-600 hover:underline dark:text-teal-500">
                    Sign up
                  </Link>
                </p>
              </form>

              {showPopup && (
                <div className="text-center mt-4">
                  <p className="text-red-500">Your email is not verified.</p>
                  <button
                    onClick={handleResendVerification}
                    className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-4 py-2"
                    disabled={resending}  // Disable resend button while resending
                  >
                    {resending ? "Resending..." : "Resend Verification Email"}
                  </button>
                </div>
              )}

              <div className="text-center mt-4">
                <Link to="/forgot-password" className="font-medium text-teal-600 hover:underline dark:text-teal-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
