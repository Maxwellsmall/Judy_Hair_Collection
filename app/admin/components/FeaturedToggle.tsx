'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { getFeaturedIconClass } from '../utils/featuredToggleUtils';

export { getFeaturedIconClass };

interface FeaturedToggleProps {
  productId: string;
  initialFeatured: boolean;
  onSuccess?: (newValue: boolean) => void;
}

export default function FeaturedToggle({
  productId,
  initialFeatured,
  onSuccess,
}: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;

    const newValue = !featured;
    // Optimistic update
    setFeatured(newValue);
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: newValue }),
      });

      if (!res.ok) throw new Error('Failed to update featured status');

      toast.success('Featured status updated');
      onSuccess?.(newValue);
    } catch {
      // Revert on failure
      setFeatured(!newValue);
      toast.error('Failed to update featured status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={featured ? 'Remove from featured' : 'Add to featured'}
      className="p-1 rounded-full transition-colors hover:bg-black/10 disabled:opacity-50"
    >
      <Star
        size={18}
        className={featured ? 'text-amber-500 fill-current' : 'text-neutral-300'}
      />
    </button>
  );
}


