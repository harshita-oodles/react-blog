import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection
import { Link } from "react-router-dom";  // Import Link to avoid the 'Link is not defined' error
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use navigate to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if the email is provided
    if (email) {
      try {
        // API request to send password reset link
        const response = await fetch("http://localhost:8000/api/request-password-reset/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("A password reset link has been sent to your email.");
          toast.success("A password reset link has been sent to your email.");

          // Redirect to the reset password page with the token
          navigate(`/reset-password?token=${data.token}`);
        } else {
          setMessage(data.detail || "Failed to send reset link.");
          toast.error(data.detail || "Failed to send reset link.");
        }
      } catch (error) {
        setMessage("There was an error. Please try again later.");
        toast.error("There was an error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <section>
        {message && (
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
        )}

        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[80vh] lg:py-0">
          <div className="w-full bg-primary-neutral rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Forgot your password?
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-primary-base shadow-lg sm:text-sm rounded-lg focus:ring-primary block w-full p-2.5 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
