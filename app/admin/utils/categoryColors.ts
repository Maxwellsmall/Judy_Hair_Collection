const CATEGORY_COLORS = [
  { bg: 'bg-amber-100',  text: 'text-amber-800',  hex: '#f59e0b' },
  { bg: 'bg-blue-100',   text: 'text-blue-800',   hex: '#3b82f6' },
  { bg: 'bg-green-100',  text: 'text-green-800',  hex: '#22c55e' },
  { bg: 'bg-purple-100', text: 'text-purple-800', hex: '#a855f7' },
  { bg: 'bg-red-100',    text: 'text-red-800',    hex: '#ef4444' },
  { bg: 'bg-orange-100', text: 'text-orange-800', hex: '#f97316' },
  { bg: 'bg-teal-100',   text: 'text-teal-800',   hex: '#14b8a6' },
  { bg: 'bg-pink-100',   text: 'text-pink-800',   hex: '#ec4899' },
];

export function getCategoryColor(name: string) {
  const index = name.charCodeAt(0) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
}

export { CATEGORY_COLORS };
