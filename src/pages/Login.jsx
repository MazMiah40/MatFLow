import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleGuestLogin() {
    loginAsGuest();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">MatCraft</h1>
          <p className="text-gray-400 mt-2">Session planning for combat sports coaches</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              placeholder="coach@gym.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-red-400 hover:text-red-300">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-lg text-white transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or</span>
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          type="button"
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 font-semibold rounded-lg text-gray-200 transition duration-200 mb-6"
        >
          Try demo mode
        </button>

        <p className="text-center text-sm text-gray-400">
          Need an account?{' '}
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
