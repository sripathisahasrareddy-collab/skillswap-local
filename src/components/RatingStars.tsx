import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showNumber?: boolean;
}

export default function RatingStars({
  rating,
  size = 16,
  interactive = false,
  onChange,
  showNumber = false,
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            style={{ width: size, height: size }}
            className={
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }
          />
        </button>
      ))}
      {showNumber && (
        <span className="ml-1.5 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
