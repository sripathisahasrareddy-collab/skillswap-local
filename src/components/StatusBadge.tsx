import type { BookingStatus } from '@/types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  ACCEPTED: { label: 'Accepted', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} ${c.text} px-3 py-1 text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
