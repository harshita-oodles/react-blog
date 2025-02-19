import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, userLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const toggleNav = () => {
    setShow(!show);
  };

  return (
    <header className="bg-gray-500 shadow-md">
      <nav className="flex flex-wrap items-center justify-between w-full px-6 py-4">
        {/* Logo */}
        <div>
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-primary">B</span>logging
            <span className="text-primary"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden border border-primary rounded-lg p-2 text-white focus:outline-none"
          type="button"
          onClick={toggleNav}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navbar Links */}
        <div
          className={`${
            show ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-4 text-gray-300 text-base">
            <li className="hover:text-primary font-semibold">
              <Link to="/technology">Technology</Link>
            </li>
            <li className="hover:text-primary font-semibold">
              <Link to="/education">Education</Link>
            </li>
            <li className="hover:text-primary font-semibold">
              <Link to="/music">Music</Link>
            </li>

            {/* User Profile & Logout */}
            {user ? (
              <>
                <li className="hover:text-primary font-semibold">
                  <Link to="/profile">
                    <span className="text-primary">{user.username}</span>
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded transition-all"
                    onClick={() => {
                      userLogout();
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="hover:text-primary font-semibold">
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded transition-all"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
