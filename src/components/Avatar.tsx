import { initialsFor } from '@/lib/storage';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export default function Avatar({ name, color = 'bg-blue-500', size = 'md' }: AvatarProps) {
  return (
    <div
      className={`${SIZES[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
    >
      {initialsFor(name)}
    </div>
  );
}
