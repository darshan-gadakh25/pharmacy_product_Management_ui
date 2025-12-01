import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user.role === 'ADMIN') {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        apiService.orders.getAll(),
        apiService.products.getAll()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await apiService.orders.confirm(orderId);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'CONFIRMED' } : order
      ));
      toast.success('Order confirmed successfully');
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await apiService.orders.cancel(orderId);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      ));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await apiService.products.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
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

  if (!isAuthenticated || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access denied. Admin login required.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">
            Admin Dashboard
          </h1>
          <p className="text-center text-gray-600">
            Welcome back, {user.fullName}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-green-600">{orders.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'PENDING').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-purple-600">
              ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'products'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Products Management
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Order #{order.id}</span>
                          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Low Stock Products</h3>
                    <div className="space-y-2">
                      {products.filter(p => p.stockQuantity < 10).slice(0, 5).map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span>{product.productName}</span>
                          <span className="text-red-600 font-medium">Stock: {product.stockQuantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-2">#{order.id}</td>
                          <td className="px-4 py-2">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{order.customerId}</td>
                          <td className="px-4 py-2">₹{order.totalAmount}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              {order.status === 'PENDING' && (
                                <button
                                  onClick={() => handleConfirmOrder(order.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Products Management</h2>
                  <Link
                    to="/add-product"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add New Product
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Product Name</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Supplier</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="px-4 py-2">
                            <div>
                              <div className="font-medium">{product.productName}</div>
                              <div className="text-sm text-gray-500">{product.manufacturer}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2">{product.category}</td>
                          <td className="px-4 py-2">₹{product.price}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              product.stockQuantity > 10 
                                ? 'bg-green-100 text-green-800'
                                : product.stockQuantity > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stockQuantity}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {product.supplier?.companyName || 'N/A'}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <Link
                                to={`/edit-product/${product.id}`}
                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;