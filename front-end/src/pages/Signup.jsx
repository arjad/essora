import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        window.location.href = '/'; // Reload to update navbar
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-primary italic mb-2 tracking-tight">Join Essora</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Create your luxury account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-lg mb-6 uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-4 py-4 rounded-xl text-primary focus:outline-none focus:border-primary transition-all"
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-4 py-4 rounded-xl text-primary focus:outline-none focus:border-primary transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 px-4 py-4 rounded-xl text-primary focus:outline-none focus:border-primary transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 px-4 py-4 rounded-xl text-primary focus:outline-none focus:border-primary transition-all"
              placeholder="At least 6 characters"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-xs font-medium">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-bold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
