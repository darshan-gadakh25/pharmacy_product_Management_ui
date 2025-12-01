import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin-dashboard';
      case 'SUPPLIER': return '/supplier-dashboard';
      case 'CUSTOMER': return '/customer-dashboard';
      default: return '/login';
    }
  };

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
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
            >
              Products
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
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
                >
                  Dashboard
                </Link>
                {user.role === 'CUSTOMER' && (
                  <Link
                    to="/cart"
                    className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
                  >
                    Cart
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Hi, {user?.fullName?.split(" ")[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-all duration-300 font-medium hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
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
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'CUSTOMER' && (
                    <Link
                      to="/cart"
                      className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  )}
                  <div className="py-2 px-4 text-sm">
                    Hi, {user?.fullName}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 px-4 hover:bg-blue-600 rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="py-2 px-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
