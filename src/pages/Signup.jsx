// Signup.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-yellow-100">
      <form onSubmit={handleSignup} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Sign Up</h2>
        {['name', 'email', 'password'].map((field, idx) => (
          <input
            key={idx}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        ))}
        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition duration-300">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
