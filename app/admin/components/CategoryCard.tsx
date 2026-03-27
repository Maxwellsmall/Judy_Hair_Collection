'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { CategoryModel } from '../../../src/lib/api';

interface CategoryCardProps {
  category: CategoryModel;
  productCount: number;
  onDelete: (id: string) => void;
}

export default function CategoryCard({ category, productCount, onDelete }: CategoryCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasImage = Boolean(category.image);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Category deleted');
      onDelete(category._id);
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <div className="rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden bg-white">
        {/* Image / placeholder */}
        <div className="relative aspect-video overflow-hidden">
          {hasImage ? (
            <Image
              src={category.image!}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Color dot + name */}
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10"
              style={{ backgroundColor: category.color }}
              aria-label={`Color: ${category.color}`}
            />
            <h3 className="text-sm font-semibold truncate">{category.name}</h3>
          </div>

          {/* Slug */}
          <p className="text-xs text-neutral-500 font-mono">/{category.slug}</p>

          {/* Product count */}
          <p className="text-xs text-neutral-500">{productCount} products</p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Link
              href={`/admin/products?category=${category.slug}`}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ExternalLink size={12} />
              View Products
            </Link>

            <Link
              href={`/admin/categories/${category._id}/edit`}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <Pencil size={12} />
              Edit
            </Link>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="text-base font-semibold">Delete category?</h3>
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete <strong>{category.name}</strong>? Products in this
              category will not be deleted.
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
