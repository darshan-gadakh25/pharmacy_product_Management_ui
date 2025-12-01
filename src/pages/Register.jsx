import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { apiService } from "../services/api";

const Register = () => {
  const [role, setRole] = useState('CUSTOMER');
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    // Customer specific
    gender: "",
    dateOfBirth: "",
    altMobile: "",
    // Supplier specific
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    supplyCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (role === 'CUSTOMER') {
        const customerData = {
          userDetails: {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            mobile: form.mobile,
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            role: 'CUSTOMER'
          },
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          altMobile: form.altMobile || '',
          loyaltyPoints: 0
        };
        console.log('Sending customer data:', customerData);
        response = await apiService.customers.register(customerData);
      } else if (role === 'SUPPLIER') {
        const supplierData = {
          userDetails: {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            mobile: form.mobile,
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            role: 'SUPPLIER'
          },
          companyName: form.companyName,
          companyAddress: form.companyAddress,
          companyEmail: form.companyEmail,
          companyPhone: form.companyPhone,
          supplyCategory: form.supplyCategory
        };
        console.log('Sending supplier data:', supplierData);
        response = await apiService.suppliers.register(supplierData);
      }
      
      console.log('Registration response:', response);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      
      let errorMsg = 'Registration failed. Please try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Network error: Please check if backend server is running';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data) {
        errorMsg = JSON.stringify(error.response.data);
      } else if (error.message.includes('CORS')) {
        errorMsg = 'CORS error: Backend server CORS configuration issue';
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Pharmacy Registration
        </h2>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Register as:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="CUSTOMER"
                checked={role === 'CUSTOMER'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="SUPPLIER"
                checked={role === 'SUPPLIER'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Supplier
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="state"
              placeholder="State"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Customer Specific Fields */}
          {role === 'CUSTOMER' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender:</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="OTHER"
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleChange}
                  value={form.dateOfBirth}
                  required
                />
              </div>
              <input
                type="tel"
                name="altMobile"
                placeholder="Alternative Mobile (Optional)"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
              />
            </>
          )}

          {/* Supplier Specific Fields */}
          {role === 'SUPPLIER' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="companyEmail"
                  placeholder="Company Email"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="companyPhone"
                  placeholder="Company Phone"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="supplyCategory"
                  placeholder="Supply Category"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="companyAddress"
                placeholder="Company Address"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
                required
              ></textarea>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;