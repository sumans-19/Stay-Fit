import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/register', form);
      alert('Registration successful');
      navigate('/');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-[500px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {['name', 'email', 'password', 'age', 'weight', 'height', 'gender', 'activity_level', 'goal', 'allergies', 'dislikes'].map(field => (
          <input
            key={field}
            className="w-full mb-3 p-2 border rounded"
            placeholder={field.replace('_', ' ').toUpperCase()}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            onChange={handleChange}
            required
          />
        ))}
        <label className="block mb-2">
          Preference:
          <select name="preference" className="w-full mt-1 border p-2 rounded" onChange={handleChange}>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
        </label>
        <div className="flex justify-between my-4">
          <label>
            <input type="checkbox" name="is_diabetic" onChange={handleChange} /> Diabetic
          </label>
          <label>
            <input type="checkbox" name="is_pregnant" onChange={handleChange} /> Pregnant
          </label>
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
