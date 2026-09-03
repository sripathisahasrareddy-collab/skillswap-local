import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, DollarSign, MapPin, Clock, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getData, addData, generateId, categoryForSkill } from '@/lib/storage';
import type { Service, PriceType, Availability } from '@/types';

const SKILLS = [
  'Laptop Repair', 'Mobile Repair', 'Plumbing', 'Electrical Work',
  'Python Tutoring', 'Graphic Design', 'Photography', 'Video Editing',
  'Web Development', 'Home Appliance Repair',
];

const PRICE_TYPES: PriceType[] = ['Fixed', 'Per Hour', 'Starting From'];
const AVAILABILITIES: Availability[] = ['Available Today', 'Weekdays', 'Weekends', 'Evenings'];
const RADII = [2, 5, 10];

export default function OfferPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skill: '',
    title: '',
    description: '',
    price: '',
    priceType: 'Starting From' as PriceType,
    serviceRadius: 5,
    availability: 'Weekends' as Availability,
    experience: '',
    distance: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.skill) e.skill = 'Please select a skill';
    if (!form.title.trim()) e.title = 'Service title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.experience.trim()) e.experience = 'Experience is required';
    if (!form.distance || Number(form.distance) <= 0) e.distance = 'Enter a valid distance';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const existingServices = getData<Service>('services');
    const distance = Number(form.distance);

    const service: Service = {
      id: generateId(),
      providerId: user.id,
      providerName: user.fullName,
      skill: form.skill,
      category: categoryForSkill(form.skill),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      priceType: form.priceType,
      serviceRadius: form.serviceRadius,
      availability: form.availability,
      experience: form.experience.trim(),
      distance,
      rating: 0,
      createdAt: new Date().toISOString(),
    };

    addData<Service>('services', service);
    toast('Service published successfully!');
    navigate(`/providers/${user.id}`);
  };

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Offer a Skill</h1>
        <p className="text-gray-500 mt-1">Publish your service so people nearby can find and book you</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
        {/* Skill */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <Wrench className="w-4 h-4 inline mr-1" /> Skill
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update('skill', s)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  form.skill === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {errors.skill && <p className="text-xs text-rose-600 mt-1">{errors.skill}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Professional Laptop Repair & Diagnostics"
            className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-rose-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            placeholder="Describe what you offer, what's included, and why customers should choose you..."
            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-rose-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none`}
          />
          {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
        </div>

        {/* Price + type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <DollarSign className="w-4 h-4 inline mr-1" /> Price (₹)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="e.g. 300"
              className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-rose-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
            />
            {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price Type</label>
            <select
              value={form.priceType}
              onChange={(e) => update('priceType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              {PRICE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Radius + availability */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1" /> Service Radius
            </label>
            <div className="flex gap-2">
              {RADII.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update('serviceRadius', r)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    form.serviceRadius === r ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Clock className="w-4 h-4 inline mr-1" /> Availability
            </label>
            <select
              value={form.availability}
              onChange={(e) => update('availability', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              {AVAILABILITIES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience + distance */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience</label>
            <input
              type="text"
              value={form.experience}
              onChange={(e) => update('experience', e.target.value)}
              placeholder="e.g. 5 years"
              className={`w-full px-4 py-3 rounded-xl border ${errors.experience ? 'border-rose-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
            />
            {errors.experience && <p className="text-xs text-rose-600 mt-1">{errors.experience}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Distance from Customers (km)</label>
            <input
              type="number"
              step="0.1"
              value={form.distance}
              onChange={(e) => update('distance', e.target.value)}
              placeholder="e.g. 2.3"
              className={`w-full px-4 py-3 rounded-xl border ${errors.distance ? 'border-rose-300' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
            />
            {errors.distance && <p className="text-xs text-rose-600 mt-1">{errors.distance}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Publish Service
        </button>
      </form>
    </div>
  );
}
