'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../../../src/lib/api';
import { getCategoryColor } from '../utils/categoryColors';
import { formatPrice } from '../utils/productUtils';
import FeaturedToggle from './FeaturedToggle';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onFeaturedChange: (id: string, featured: boolean) => void;
}

export default function ProductCard({ product, onDelete, onFeaturedChange }: ProductCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const color = getCategoryColor(product.category);
  const imageUrl = product.images?.[0] ?? '';

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Product deleted');
      onDelete(product._id);
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <div className="rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden bg-white">
        {/* Image */}
        <div className="relative aspect-square rounded-t-xl overflow-hidden group">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
              No image
            </div>
          )}

          {/* FeaturedToggle overlay — top right */}
          <div className="absolute top-2 right-2 z-10">
            <FeaturedToggle
              productId={product._id}
              initialFeatured={product.featured}
              onSuccess={(val) => onFeaturedChange(product._id, val)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category badge */}
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
          >
            {product.category}
          </span>

          {/* Name */}
          <p className="text-sm font-medium truncate">{product.name}</p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <Pencil size={13} />
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="text-base font-semibold">Delete product?</h3>
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete <strong>{product.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
