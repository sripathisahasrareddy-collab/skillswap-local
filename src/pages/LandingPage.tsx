import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Wrench, Code, GraduationCap, Palette,
  Home, Camera, ArrowRight, CheckCircle2, Users, Shield, Zap
} from 'lucide-react';
import { getData } from '@/lib/storage';
import type { Service, User } from '@/types';
import Avatar from '@/components/Avatar';
import RatingStars from '@/components/RatingStars';

const CATEGORIES = [
  { name: 'Repair', icon: Wrench, color: 'bg-orange-50 text-orange-600' },
  { name: 'Technology', icon: Code, color: 'bg-blue-50 text-blue-600' },
  { name: 'Education', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Design', icon: Palette, color: 'bg-violet-50 text-violet-600' },
  { name: 'Home Services', icon: Home, color: 'bg-amber-50 text-amber-600' },
  { name: 'Creative Services', icon: Camera, color: 'bg-rose-50 text-rose-600' },
];

const STEPS = [
  { num: '1', title: 'Search', desc: 'Find skilled service providers near your location', icon: Search },
  { num: '2', title: 'Compare', desc: 'Check ratings, prices, distance, and match scores', icon: Zap },
  { num: '3', title: 'Request', desc: 'Send a booking request with your requirements', icon: ArrowRight },
  { num: '4', title: 'Get It Done', desc: 'Provider accepts, completes the service, you review', icon: CheckCircle2 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(5);

  const services = getData<Service>('services');
  const users = getData<User>('users');
  const featured = services.slice(0, 3);

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(query)}&radius=${radius}`);
  };

  const userFor = (name: string) => users.find((u) => u.fullName === name);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.08),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700">Trusted by 500+ local providers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight animate-slide-up">
              Find Trusted Skills <br className="hidden sm:block" />
              <span className="text-gradient">Near You</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
              Connect with skilled people nearby for repairs, tutoring, technology, creative work and everyday services.
            </p>
          </div>

          {/* Search section */}
          <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 animate-slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-2">What service do you need?</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. Laptop Repair, Python Tutoring..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900"
                />
              </div>
              <div className="flex gap-2">
                {[2, 5, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      radius === r
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Browse Categories</h2>
        <p className="text-gray-500 text-center mb-8">Explore services across different categories</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}&radius=10`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3 card-lift hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured providers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Nearby Providers</h2>
              <p className="text-gray-500 mt-1">Top-rated service providers in your area</p>
            </div>
            <button onClick={() => navigate('/search?radius=10')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((service) => {
              const provider = userFor(service.providerName);
              return (
                <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-lift">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={service.providerName} color={provider?.avatarColor} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{service.providerName}</h3>
                      <p className="text-sm text-gray-500 truncate">{service.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={service.rating} size={14} showNumber />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {service.distance} km</span>
                    <span className="flex items-center gap-1"><Wrench className="w-4 h-4" /> {service.experience}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/providers/${service.providerId}`)}
                    className="w-full text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
        <p className="text-gray-500 text-center mb-10">Get your service done in 4 simple steps</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.num}
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-5 h-5 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ratings & Reviews</h3>
              <p className="text-sm text-gray-500">Every completed service gets a rating. Check authentic reviews before booking.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Providers</h3>
              <p className="text-sm text-gray-500">Skilled professionals with experience details and service guarantees.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Community</h3>
              <p className="text-sm text-gray-500">Support local talent and build trust within your neighborhood.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_80%_20%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-3">Have a skill? Offer your service.</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">Join SkillSwap Local and start earning by offering your skills to people nearby.</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
