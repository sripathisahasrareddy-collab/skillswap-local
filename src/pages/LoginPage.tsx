import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      toast('Welcome back! Logged in successfully.');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = (type: 'provider' | 'customer') => {
    setEmail(type === 'provider' ? 'provider@skillswap.com' : 'customer@skillswap.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Log in to your SkillSwap Local account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Login <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">Create Account</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-blue-800 mb-3">Try demo accounts:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemo('provider')}
              className="bg-white rounded-xl border border-blue-200 p-3 text-left hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">Provider</span>
              </div>
              <p className="text-xs text-gray-500">provider@skillswap.com</p>
              <p className="text-xs text-gray-500">password123</p>
            </button>
            <button
              onClick={() => fillDemo('customer')}
              className="bg-white rounded-xl border border-blue-200 p-3 text-left hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-800">Customer</span>
              </div>
              <p className="text-xs text-gray-500">customer@skillswap.com</p>
              <p className="text-xs text-gray-500">password123</p>
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-2 text-center">Click a card to auto-fill credentials</p>
        </div>
      </div>
    </div>
  );
}
