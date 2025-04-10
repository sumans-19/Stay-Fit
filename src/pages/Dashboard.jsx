// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState({ age: '', weight: '', height: '', gender: '', activity_level: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setUser(userInfo);
    } else {
      setError("User not logged in");
    }
  }, []);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError('User ID is missing. Please log in again.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/user-details', { ...details, user_id: user.id });
      setSubmitted(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        {user ? (
          <>
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Welcome, {user.name}!</h2>
            <p className="text-sm text-gray-600 mb-1">"Stay strong, the journey is worth it!"</p>
            <p className="text-sm text-gray-600 mb-1">"You don’t have to be extreme, just consistent."</p>
            <p className="text-sm text-gray-600 mb-4">"Small steps every day lead to big results."</p>

            {submitted ? (
              <p className="text-green-600 font-medium text-center">Details saved successfully!</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="number" name="age" placeholder="Age" value={details.age} onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                <input type="number" name="weight" placeholder="Weight (kg)" value={details.weight} onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                <input type="number" name="height" placeholder="Height (cm)" value={details.height} onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                <select name="gender" value={details.gender} onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select name="activity_level" value={details.activity_level} onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required>
                  <option value="">Activity Level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-300">
                  Save Details
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>
            )}
          </>
        ) : (
          <p className="text-red-600">Please log in to access your dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
