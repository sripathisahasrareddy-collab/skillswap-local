import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Star, Wrench, PlusCircle, Edit3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getData } from '@/lib/storage';
import type { Service, Review } from '@/types';
import Avatar from '@/components/Avatar';
import RatingStars from '@/components/RatingStars';
import { formatPrice } from '@/lib/format';

export default function ProfilePage() {
  const { user } = useAuth();

  const { services, reviews } = useMemo(() => {
    if (!user) return { services: [], reviews: [] };
    return {
      services: getData<Service>('services').filter((s) => s.providerId === user.id),
      reviews: getData<Review>('reviews').filter((r) => r.providerId === user.id),
    };
  }, [user]);

  if (!user) return null;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar name={user.fullName} color={user.avatarColor} size="xl" />
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {user.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</span>
              </div>
            </div>
            <Link to="/offer" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add Service
            </Link>
          </div>
          {user.bio && <p className="text-gray-600 mt-4 max-w-2xl">{user.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Wrench className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{services.length}</p>
          <p className="text-sm text-gray-500">Services</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Edit3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
          <p className="text-sm text-gray-500">Reviews</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My services */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Services</h2>
          {services.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Wrench className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No services yet</p>
              <p className="text-sm text-gray-400 mt-1">Offer a skill to get started.</p>
              <Link to="/offer" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                Offer a Skill →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{s.category}</span>
                    </div>
                    <span className="font-bold text-blue-600 whitespace-nowrap">{formatPrice(s.price, s.priceType)}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {s.distance} km</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {s.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews received */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews Received</h2>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No reviews yet</p>
              <p className="text-sm text-gray-400 mt-1">Reviews appear after you complete a service.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={r.customerName} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.customerName}</p>
                      <RatingStars rating={r.rating} size={14} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
