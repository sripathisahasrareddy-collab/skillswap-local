import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, MapPin, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', location: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = register({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      location: form.location.trim(),
    });
    if (result.success) {
      toast('Account created successfully! Welcome to SkillSwap Local.');
      navigate('/dashboard');
    } else {
      setErrors({ email: result.error });
    }
  };

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const fields: { key: keyof typeof form; label: string; type: string; icon: typeof UserIcon; placeholder: string }[] = [
    { key: 'fullName', label: 'Full Name', type: 'text', icon: UserIcon, placeholder: 'John Doe' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone', type: 'tel', icon: Phone, placeholder: '9876543210' },
    { key: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'Koramangala, Bangalore' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join SkillSwap Local today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors[f.key as keyof FormErrors] ? 'border-rose-300' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                  />
                </div>
                {errors[f.key as keyof FormErrors] && (
                  <p className="text-xs text-rose-600 mt-1">{errors[f.key as keyof FormErrors]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border ${
                    errors.password ? 'border-rose-300' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.confirmPassword ? 'border-rose-300' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
