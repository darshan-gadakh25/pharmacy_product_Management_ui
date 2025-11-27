import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    gender: "",
    dob: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
    alert("Registration form submitted");
  };

  return (
    <div className="w-full h-screen bg-blue-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Pharmacy Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
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

          <div className="flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Gender:</label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
              />{" "}
              Female
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
              />{" "}
              Male
            </label>
          </div>

          <input
            type="date"
            name="Date Of Birth"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Register
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