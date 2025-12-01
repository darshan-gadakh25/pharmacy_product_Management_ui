import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user.role === 'CUSTOMER') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      const data = await apiService.orders.getByCustomer(user.id);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PROCESSING': 'bg-purple-100 text-purple-800',
      'SHIPPED': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'RETURNED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated || user.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access denied. Customer login required.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">
            Customer Dashboard
          </h1>
          <p className="text-center text-gray-600">
            Welcome back, {user.fullName}!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/products"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
            <p className="text-gray-600">Explore our pharmacy products</p>
          </Link>
          
          <Link
            to="/cart"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">My Cart</h3>
            <p className="text-gray-600">View items in your cart</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Loyalty Points</h3>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Order History</h2>
          
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No orders found</p>
              <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product.productName} × {item.quantity}</span>
                          <span>₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Delivery Address:</strong> {order.deliveryAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;