import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../utils/hooks';
import bgImage from '../assets/cosmic-purple-planet.jpg';

export default function AdminLogin() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isRegistering = mode === 'register';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isRegistering
        ? await authAPI.register(form)
        : await authAPI.login(form.email, form.password);

      login(response.token, response.user);
      navigate('/admin/dashboard');
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl">
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded ${
              !isRegistering
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded ${
              isRegistering
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {isRegistering ? 'OWN YOUR PORTFOLIO' : 'OWN SPACE LOGIN'}
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="text-white">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black/40 text-white rounded"
                  required
                />
              </div>

              <div>
                <label className="text-white">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black/40 text-white rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-white">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-black/40 text-white rounded"
              required
            />
          </div>

          <div>
            <label className="text-white">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-black/40 text-white rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
          >
            {loading
              ? 'Working...'
              : isRegistering
              ? 'Create Account'
              : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}