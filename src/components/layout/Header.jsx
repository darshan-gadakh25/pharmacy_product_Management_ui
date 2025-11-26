import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-500 text-white shadow-2xl backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">💊</span>

            <Link
              to="/"
              className="text-3xl font-bold bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              PharmaCare
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="hover:text-blue-600 transition-all duration-600 font-medium hover:scale-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              to="/login"
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              Sign Up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3 bg-blue-700 rounded-lg p-4 mt-4">
              <Link
                to="/"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
              >
                Contact Us
              </Link>
              <Link
                to="/login"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="py-2 px-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 text-center"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
