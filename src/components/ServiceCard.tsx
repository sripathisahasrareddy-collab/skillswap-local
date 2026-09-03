import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Wrench, Zap } from 'lucide-react';
import type { Service } from '@/types';
import { calculateMatch, matchReasons } from '@/lib/matching';
import { formatPrice } from '@/lib/format';
import Avatar from './Avatar';

interface ServiceCardProps {
  service: Service;
  searchRadius: number;
  providerAvatarColor?: string;
}

export default function ServiceCard({ service, searchRadius, providerAvatarColor }: ServiceCardProps) {
  const match = calculateMatch(service, searchRadius);
  const reasons = matchReasons(match);
  const matchColor = match.total >= 85 ? 'text-emerald-600 bg-emerald-50' : match.total >= 70 ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-100';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-lift hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar name={service.providerName} color={providerAvatarColor} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{service.providerName}</h3>
            <p className="text-sm text-gray-500 truncate">{service.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {service.category}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className={`flex-shrink-0 text-right`}>
            <span className={`inline-block text-sm font-bold px-2.5 py-1 rounded-lg ${matchColor}`}>
              {match.total}% Match
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{service.distance} km away</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">₹</span>
            <span className="font-medium text-gray-700">{formatPrice(service.price, service.priceType)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="truncate">{service.availability}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-gray-400" />
            <span>{service.experience}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Why this match?</p>
          <div className="flex flex-wrap gap-1.5">
            {reasons.map((r) => (
              <span key={r} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                <Zap className="w-3 h-3 text-blue-500" />
                {r}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/providers/${service.providerId}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
