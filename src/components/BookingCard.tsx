import { formatPrice } from '@/lib/format';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';

interface BookingCardProps {
  booking: import('@/types').Booking;
  otherUserName: string;
  otherUserColor?: string;
  showActions?: boolean;
  onComplete?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onReview?: () => void;
}

export default function BookingCard({
  booking,
  otherUserName,
  otherUserColor,
  showActions = false,
  onComplete,
  onAccept,
  onReject,
  onReview,
}: BookingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={otherUserName} color={otherUserColor} size="md" />
          <div>
            <p className="font-semibold text-gray-900">{otherUserName}</p>
            <p className="text-sm text-gray-500">{booking.serviceTitle}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div>
          <span className="text-gray-400 text-xs">Date</span>
          <p className="font-medium text-gray-700">
            {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Price</span>
          <p className="font-medium text-gray-700">{formatPrice(booking.price, booking.priceType)}</p>
        </div>
      </div>

      {booking.message && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-gray-400 mb-0.5">Message</p>
          <p className="text-sm text-gray-600">{booking.message}</p>
        </div>
      )}

      {showActions && (
        <div className="flex flex-wrap gap-2">
          {booking.status === 'PENDING' && onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Accept
            </button>
          )}
          {booking.status === 'PENDING' && onReject && (
            <button
              onClick={onReject}
              className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Reject
            </button>
          )}
          {booking.status === 'ACCEPTED' && onComplete && (
            <button
              onClick={onComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Mark Completed
            </button>
          )}
          {booking.status === 'COMPLETED' && !booking.hasReview && onReview && (
            <button
              onClick={onReview}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Leave a Review
            </button>
          )}
          {booking.status === 'COMPLETED' && booking.hasReview && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <RatingStars rating={5} size={14} />
              <span className="font-medium">Reviewed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
