import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [orderForm, setOrderForm] = useState({
    deliveryAddress: '',
    paymentMethod: 'CASH_ON_DELIVERY',
    prescriptionImage: ''
  });
  const [creditCard, setCreditCard] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== 'CUSTOMER') {
      navigate('/login');
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      if (cartData.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(cartData);
    } else {
      navigate('/cart');
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreditCardChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCreditCard({
      ...creditCard,
      [name]: value
    });
  };

  const validateCreditCard = () => {
    if (orderForm.paymentMethod !== 'CREDIT_CARD') return true;
    
    const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv, billingAddress } = creditCard;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return false;
    }
    
    if (!cardHolderName || cardHolderName.length < 2) {
      toast.error('Please enter card holder name');
      return false;
    }
    
    if (!expiryMonth || !expiryYear) {
      toast.error('Please enter expiry date');
      return false;
    }
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (parseInt(expiryYear) < currentYear || 
        (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
      toast.error('Card has expired');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    if (!billingAddress) {
      toast.error('Please enter billing address');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrderForm({
          ...orderForm,
          prescriptionImage: reader.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const hasPrescriptionRequired = () => {
    return cart.some(item => item.prescriptionRequired);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasPrescriptionRequired() && !orderForm.prescriptionImage) {
      toast.error('Please upload prescription for prescription-required medicines');
      return;
    }

    if (!validateCreditCard()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        totalAmount: getTotalAmount(),
        deliveryAddress: orderForm.deliveryAddress,
        paymentMethod: orderForm.paymentMethod,
        prescriptionImage: orderForm.prescriptionImage,
        customerId: user.id,
        orderItems: cart.map(item => ({
          quantity: item.quantity,
          productId: item.id
        }))
      };

      // Add credit card data if payment method is CREDIT_CARD
      if (orderForm.paymentMethod === 'CREDIT_CARD') {
        orderData.creditCard = {
          cardNumber: creditCard.cardNumber.replace(/\s/g, ''),
          cardHolderName: creditCard.cardHolderName,
          expiryMonth: creditCard.expiryMonth,
          expiryYear: creditCard.expiryYear,
          cvv: creditCard.cvv,
          billingAddress: creditCard.billingAddress
        };
      }

      await apiService.orders.createWithPayment(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate('/customer-dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to place order';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Checkout
        </h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your complete delivery address"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={orderForm.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>

              {/* Credit Card Form */}
              {orderForm.paymentMethod === 'CREDIT_CARD' && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Credit Card Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={creditCard.cardNumber}
                        onChange={handleCreditCardChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Card Holder Name *
                      </label>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={creditCard.cardHolderName}
                        onChange={handleCreditCardChange}
                        placeholder="John Doe"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Expiry Month *
                      </label>
                      <select
                        name="expiryMonth"
                        value={creditCard.expiryMonth}
                        onChange={handleCreditCardChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Expiry Year *
                      </label>
                      <select
                        name="expiryYear"
                        value={creditCard.expiryYear}
                        onChange={handleCreditCardChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Year</option>
                        {Array.from({length: 10}, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        CVV *
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={creditCard.cvv}
                        onChange={handleCreditCardChange}
                        placeholder="123"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="4"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Billing Address *
                      </label>
                      <textarea
                        name="billingAddress"
                        value={creditCard.billingAddress}
                        onChange={handleCreditCardChange}
                        placeholder="Enter billing address"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {hasPrescriptionRequired() && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Prescription Image * (Required for prescription medicines)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please upload a clear image of your prescription
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                    {item.prescriptionRequired && (
                      <p className="text-xs text-red-600">⚠️ Prescription Required</p>
                    )}
                  </div>
                  <div className="font-bold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            {hasPrescriptionRequired() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your order contains prescription medicines. 
                  Please upload a valid prescription to complete your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;