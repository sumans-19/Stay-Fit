import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressChart from '../components/ProgressChart';


const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [progress, setProgress] = useState([]);
  const [userPrefs, setUserPrefs] = useState({
    preference: 'veg',
    goal: 'weight_loss',
    allergies: '',
    is_diabetic: false,
  });
  // Simulate fetching demo progress data
  useEffect(() => {
    const demoData = [
      { date: '2025-04-01', weight: 70, calories_consumed: 1800 },
      { date: '2025-04-02', weight: 69.9, calories_consumed: 1750 },
      { date: '2025-04-03', weight: 69.7, calories_consumed: 1700 },
      { date: '2025-04-04', weight: 69.5, calories_consumed: 1680 },
      { date: '2025-04-05', weight: 69.4, calories_consumed: 1650 },
      { date: '2025-04-06', weight: 69.3, calories_consumed: 1600 },
      { date: '2025-04-07', weight: 69.1, calories_consumed: 1550 },
    ];
    setProgress(demoData);
  }, []);

  useEffect(() => {
    fetchRecommendations();
    fetchProgress();
  }, [userPrefs]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/foods', {
        params: {
          preference: userPrefs.preference,
          goal: userPrefs.goal,
          allergies: userPrefs.allergies,
        },
      });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (key) => {
    setUserPrefs({ ...userPrefs, [key]: !userPrefs[key] });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">🥗 Your Healthy Dashboard</h1>

      {/* Progress Chart Section */}
      <div className="mb-8">
        <ProgressChart data={progress} />
      </div>

      {/* Toggle Section */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          className={`px-4 py-2 rounded ${userPrefs.preference === 'veg' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUserPrefs({ ...userPrefs, preference: 'veg' })}
        >
          Vegetarian
        </button>
        <button
          className={`px-4 py-2 rounded ${userPrefs.preference === 'nonveg' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUserPrefs({ ...userPrefs, preference: 'nonveg' })}
        >
          Non-Vegetarian
        </button>
        <button
          className={`px-4 py-2 rounded ${userPrefs.is_diabetic ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleToggle('is_diabetic')}
        >
          {userPrefs.is_diabetic ? 'Diabetic ✅' : 'Diabetic ❌'}
        </button>
      </div>

      {/* Meals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {foods.map((food) => (
          <div key={food.id} className="bg-white p-4 rounded shadow-md">
            <h3 className="font-semibold text-lg">{food.name}</h3>
            <p>Calories: {food.calories}</p>
            <p>Protein: {food.protein}g</p>
            <p>Carbs: {food.carbs}g</p>
            <p>Fats: {food.fats}g</p>
            <p>Fiber: {food.fiber}g</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">📊 Progress Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progress}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight" />
            <Line type="monotone" dataKey="calories_consumed" stroke="#82ca9d" name="Calories" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  
};

export default Dashboard;
