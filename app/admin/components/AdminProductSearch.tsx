'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface AdminProductSearchProps {
  defaultValue?: string;
}

export default function AdminProductSearch({ defaultValue = '' }: AdminProductSearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(window.location.search);
        if (value.trim()) {
          params.set('search', value.trim());
        } else {
          params.delete('search');
        }
        router.push(`?${params.toString()}`);
      });
    }, 300);
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* Progress bar strip while navigation is pending */}
      {isPending && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 animate-pulse" />
        </div>
      )}

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="text"
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
}
