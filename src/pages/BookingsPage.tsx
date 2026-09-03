import { useMemo, useState } from 'react';
import { Inbox, Send, Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getData, updateData } from '@/lib/storage';
import type { Booking, User, Service, Review } from '@/types';
import BookingCard from '@/components/BookingCard';
import Modal from '@/components/Modal';
import RatingStars from '@/components/RatingStars';
import { generateId, addData } from '@/lib/storage';

export default function BookingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { bookings, users } = useMemo(() => {
    return {
      bookings: getData<Booking>('bookings'),
      users: getData<User>('users'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (!user) return null;

  const myRequests = bookings
    .filter((b) => b.customerId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const incomingRequests = bookings
    .filter((b) => b.providerId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const refresh = () => setRefreshKey((k) => k + 1);

  const userColor = (id: string) => users.find((u) => u.id === id)?.avatarColor;
  const userName = (id: string) => users.find((u) => u.id === id)?.fullName || 'Unknown';

  const updateBookingStatus = (bookingId: string, status: Booking['status'], message: string) => {
    updateData<Booking>('bookings', bookingId, { status });
    refresh();
    toast(message);
  };

  const handleAccept = (id: string) => updateBookingStatus(id, 'ACCEPTED', 'Booking accepted!');
  const handleReject = (id: string) => updateBookingStatus(id, 'REJECTED', 'Booking rejected.');
  const handleComplete = (id: string) => updateBookingStatus(id, 'COMPLETED', 'Service marked as completed!');

  const openReview = (booking: Booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment('');
  };

  const submitReview = () => {
    if (!reviewBooking) return;
    if (!reviewComment.trim()) {
      toast('Please write a comment for your review', 'error');
      return;
    }
    setSubmittingReview(true);

    const review: Review = {
      id: generateId(),
      bookingId: reviewBooking.id,
      serviceId: reviewBooking.serviceId,
      providerId: reviewBooking.providerId,
      customerId: reviewBooking.customerId,
      customerName: reviewBooking.customerName,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    };

    addData<Review>('reviews', review);

    // Mark booking as reviewed
    updateData<Booking>('bookings', reviewBooking.id, { hasReview: true });

    // Recalculate provider's average rating from all reviews
    const allReviews = getData<Review>('reviews').filter((r) => r.providerId === reviewBooking.providerId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    // Update all of this provider's services with the new average rating
    const services = getData<Service>('services');
    services
      .filter((s) => s.providerId === reviewBooking.providerId)
      .forEach((s) => updateData<Service>('services', s.id, { rating: Math.round(avgRating * 10) / 10 }));

    setSubmittingReview(false);
    setReviewBooking(null);
    refresh();
    toast('Review submitted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">Manage your service requests and incoming bookings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Requests */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">My Requests</h2>
            <span className="text-sm text-gray-400">({myRequests.length})</span>
          </div>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No requests sent</p>
              <p className="text-sm text-gray-400 mt-1">Find a service and send a booking request.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUserName={userName(booking.providerId)}
                  otherUserColor={userColor(booking.providerId)}
                  showActions
                  onReview={() => openReview(booking)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Incoming Requests */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Incoming Requests</h2>
            <span className="text-sm text-gray-400">({incomingRequests.length})</span>
          </div>
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No incoming requests</p>
              <p className="text-sm text-gray-400 mt-1">When customers book your services, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUserName={userName(booking.customerId)}
                  otherUserColor={userColor(booking.customerId)}
                  showActions
                  onAccept={() => handleAccept(booking.id)}
                  onReject={() => handleReject(booking.id)}
                  onComplete={() => handleComplete(booking.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      <Modal open={!!reviewBooking} onClose={() => setReviewBooking(null)} title="Leave a Review">
        {reviewBooking && (
          <div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-semibold text-gray-900 text-sm">{reviewBooking.serviceTitle}</p>
              <p className="text-sm text-gray-500">by {reviewBooking.providerName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                <RatingStars rating={reviewRating} size={32} interactive onChange={setReviewRating} />
                <span className="text-sm font-semibold text-gray-700 ml-2">{reviewRating}/5</span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this provider..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              />
            </div>
            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Star className="w-5 h-5" /> Submit Review
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
