import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Star, Mail, Phone, Clock, Wrench, ArrowLeft,
  CheckCircle2, Calendar, MessageSquare, Send
} from 'lucide-react';
import { getData, addData, updateData, generateId } from '@/lib/storage';
import type { Service, User, Review, Booking } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Avatar from '@/components/Avatar';
import RatingStars from '@/components/RatingStars';
import Modal from '@/components/Modal';
import { formatPrice } from '@/lib/format';

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { provider, services, reviews } = useMemo(() => {
    const users = getData<User>('users');
    const allServices = getData<Service>('services');
    const allReviews = getData<Review>('reviews');
    return {
      provider: users.find((u) => u.id === id),
      services: allServices.filter((s) => s.providerId === id),
      reviews: allReviews.filter((r) => r.providerId === id).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  }, [id]);

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Provider not found.</p>
        <Link to="/search" className="text-blue-600 font-semibold mt-2 inline-block">← Back to Search</Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : services[0]?.rating ?? 0;

  const handleRequestService = (service: Service) => {
    if (!user) {
      toast('Please log in to request a service', 'info');
      navigate('/login');
      return;
    }
    if (user.id === provider.id) {
      toast('You cannot book your own service', 'error');
      return;
    }
    setBookingService(service);
  };

  const submitBooking = () => {
    if (!bookingService || !user) return;
    if (!bookingDate) {
      toast('Please select a preferred date', 'error');
      return;
    }
    setSubmitting(true);
    const booking: Booking = {
      id: generateId(),
      serviceId: bookingService.id,
      customerId: user.id,
      customerName: user.fullName,
      providerId: provider.id,
      providerName: provider.fullName,
      serviceTitle: bookingService.title,
      serviceSkill: bookingService.skill,
      price: bookingService.price,
      priceType: bookingService.priceType,
      date: bookingDate,
      message: bookingMessage.trim(),
      status: 'PENDING',
      hasReview: false,
      createdAt: new Date().toISOString(),
    };
    addData<Booking>('bookings', booking);
    setSubmitting(false);
    setBookingService(null);
    setBookingDate('');
    setBookingMessage('');
    toast('Service request sent!');
    navigate('/bookings');
  };

  const customerName = (cid: string) => {
    const users = getData<User>('users');
    return users.find((u) => u.id === cid)?.fullName || 'Customer';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar name={provider.fullName} color={provider.avatarColor} size="xl" />
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900">{provider.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)}
                  <span className="text-gray-400 font-normal">({reviews.length} reviews)</span>
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" /> {provider.location}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Wrench className="w-4 h-4" /> {services.length} service{services.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {provider.bio && (
            <p className="text-gray-600 mt-4 max-w-2xl">{provider.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Mail className="w-4 h-4" /> {provider.email}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Phone className="w-4 h-4" /> {provider.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Services Offered</h2>
          {services.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-500">No services listed yet.</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                    <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                      {service.category}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                    {formatPrice(service.price, service.priceType)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {service.availability}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" /> {service.experience}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {service.distance} km
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {service.serviceRadius} km radius
                  </div>
                </div>
                <button
                  onClick={() => handleRequestService(service)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
                >
                  Request Service
                </button>
              </div>
            ))
          )}

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Reviews appear after a service is completed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={review.customerName} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.customerName}</p>
                        <RatingStars rating={review.rating} size={14} />
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Rating</span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Reviews</span>
                <span className="font-semibold text-gray-700">{reviews.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Services</span>
                <span className="font-semibold text-gray-700">{services.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Location</span>
                <span className="font-semibold text-gray-700 text-sm">{provider.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      <Modal open={!!bookingService} onClose={() => setBookingService(null)} title="Request Service">
        {bookingService && (
          <div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={provider.fullName} color={provider.avatarColor} size="md" />
                <div>
                  <p className="font-semibold text-gray-900">{provider.fullName}</p>
                  <p className="text-sm text-gray-500">{bookingService.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" /> {bookingService.distance} km
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {avgRating.toFixed(1)} rating
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                  {formatPrice(bookingService.price, bookingService.priceType)}
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" /> {bookingService.availability}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1" /> Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <MessageSquare className="w-4 h-4 inline mr-1" /> Message / Requirement
                </label>
                <textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  rows={3}
                  placeholder="Describe what you need..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>
              <button
                onClick={submitBooking}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" /> Send Service Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
