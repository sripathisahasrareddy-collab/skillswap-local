import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Calendar, Star, CheckCircle2, Layers, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getData } from '@/lib/storage';
import type { Service, Booking, Review, User } from '@/types';
import StatCard from '@/components/StatCard';
import BookingCard from '@/components/BookingCard';
import { formatPrice } from '@/lib/format';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { services, bookings, reviews, users } = useMemo(() => {
    return {
      services: getData<Service>('services'),
      bookings: getData<Booking>('bookings'),
      reviews: getData<Review>('reviews'),
      users: getData<User>('users'),
    };
  }, []);

  if (!user) return null;

  const myServices = services.filter((s) => s.providerId === user.id);
  const myRequests = bookings.filter((b) => b.customerId === user.id);
  const incomingRequests = bookings.filter((b) => b.providerId === user.id);
  const allMyBookings = [...myRequests, ...incomingRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const completed = allMyBookings.filter((b) => b.status === 'COMPLETED');

  const myReviews = reviews.filter((r) => r.providerId === user.id);
  const avgRating = myReviews.length > 0
    ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length
    : 0;

  const recentBookings = allMyBookings.slice(0, 5);

  const userColor = (id: string) => users.find((u) => u.id === id)?.avatarColor;
  const userName = (id: string) => users.find((u) => u.id === id)?.fullName || 'Unknown';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Service Requests" value={myRequests.length + incomingRequests.length} icon={Calendar} color="text-blue-600" subtitle={`${myRequests.length} sent, ${incomingRequests.length} received`} />
        <StatCard label="Services Offered" value={myServices.length} icon={Layers} color="text-indigo-600" subtitle={myServices.length === 0 ? 'No services yet' : 'Active listings'} />
        <StatCard label="Completed Services" value={completed.length} icon={CheckCircle2} color="text-emerald-600" subtitle={completed.length === 0 ? 'None yet' : 'Successfully done'} />
        <StatCard label="Average Rating" value={avgRating > 0 ? avgRating.toFixed(1) : '—'} icon={Star} color="text-amber-600" subtitle={myReviews.length > 0 ? `${myReviews.length} reviews` : 'No reviews yet'} />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/search')}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 card-lift hover:border-blue-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Find a Skill</h3>
            <p className="text-sm text-gray-500">Search for services near you</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/offer')}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 card-lift hover:border-indigo-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Offer a Skill</h3>
            <p className="text-sm text-gray-500">Publish a service for others to find</p>
          </div>
        </button>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <button onClick={() => navigate('/bookings')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>
        {recentBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No bookings yet</p>
            <p className="text-sm text-gray-400 mt-1">Search for a service and send a request to get started.</p>
            <button onClick={() => navigate('/search')} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">
              Find a Skill →
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {recentBookings.map((booking) => {
              const otherId = booking.customerId === user.id ? booking.providerId : booking.customerId;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUserName={userName(otherId)}
                  otherUserColor={userColor(otherId)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
