import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, MapPin, X, Inbox } from 'lucide-react';
import { getData } from '@/lib/storage';
import type { Service, User } from '@/types';
import { calculateMatch } from '@/lib/matching';
import ServiceCard from '@/components/ServiceCard';

const CATEGORIES = ['All Categories', 'Repair', 'Technology', 'Education', 'Design', 'Home Services', 'Creative Services'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [radius, setRadius] = useState(Number(searchParams.get('radius')) || 5);
  const [searched, setSearched] = useState(!!searchParams.get('q') || !!searchParams.get('category'));
  const [showFilters, setShowFilters] = useState(false);

  const services = useMemo(() => getData<Service>('services'), []);
  const users = useMemo(() => getData<User>('users'), []);

  // Sync from URL on mount and back-button changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'All Categories';
    const r = Number(searchParams.get('radius')) || 5;
    setQuery(q);
    setCategory(cat);
    setRadius(r);
    setSearched(!!q || cat !== 'All Categories');
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!searched) return [];
    return services
      .filter((s) => {
        if (category !== 'All Categories' && s.category !== category) return false;
        if (radius && s.distance > radius) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) ||
            s.skill.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.providerName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .map((s) => ({ service: s, match: calculateMatch(s, radius) }))
      .sort((a, b) => b.match.total - a.match.total);
  }, [services, query, category, radius, searched]);

  const handleSearch = () => {
    setSearched(true);
    const params: Record<string, string> = { radius: String(radius) };
    if (query) params.q = query;
    if (category !== 'All Categories') params.category = category;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All Categories');
    setRadius(5);
    setSearched(false);
    setSearchParams({});
  };

  const userColor = (name: string) => users.find((u) => u.fullName === name)?.avatarColor;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find a Skill</h1>
        <p className="text-gray-500">Search for trusted service providers near you</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a service e.g. Laptop Repair..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-gray-700 font-medium text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {[2, 5, 10].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    radius === r ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filtered.length > 0
              ? `${filtered.length} service${filtered.length !== 1 ? 's' : ''} found within ${radius} km`
              : 'No services found'}
            {query && <span className="font-medium text-gray-700"> for "{query}"</span>}
          </p>
          {(query || category !== 'All Categories') && (
            <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      )}

      {!searched ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Search for services</p>
          <p className="text-sm text-gray-400 mt-1">Enter a keyword, select a category, and choose your radius to find nearby providers.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No services match your search</p>
          <p className="text-sm text-gray-400 mt-1">Try a different keyword, category, or increase the search radius.</p>
          <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ service }) => (
            <ServiceCard
              key={service.id}
              service={service}
              searchRadius={radius}
              providerAvatarColor={userColor(service.providerName)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
