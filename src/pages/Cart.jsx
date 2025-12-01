import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== 'CUSTOMER') {
      navigate('/login');
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [isAuthenticated, user, navigate]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Product removed from cart');
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated || user.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">Your cart is empty</div>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.productName}</h3>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-blue-600 font-bold">₹{item.price}</p>
                    {item.prescriptionRequired && (
                      <p className="text-red-600 text-sm">⚠️ Prescription Required</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition"
                        disabled={item.quantity >= item.stockQuantity}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-lg font-bold w-20 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{getTotalAmount().toFixed(2)}
                </span>
              </div>
              
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition text-center"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={proceedToCheckout}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;