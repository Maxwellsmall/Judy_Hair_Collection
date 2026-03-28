'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FolderOpen, ExternalLink } from 'lucide-react';
import { productsApi } from '../../../src/lib/api';
import type { Category } from '../../../src/lib/api';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data?.categories ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Categories are created automatically when you add products
          </p>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-12 text-center space-y-3">
          <FolderOpen size={40} className="mx-auto text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">No categories yet</p>
          <p className="text-xs text-neutral-400">
            Categories appear here automatically once you add products
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                {category.latestImage ? (
                  <Image
                    src={category.latestImage}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-semibold text-neutral-900">{category.name}</h3>
                <p className="text-xs text-neutral-500 font-mono">/{category.slug}</p>
                <p className="text-xs text-neutral-500">{category.count} product{category.count !== 1 ? 's' : ''}</p>
                <div className="pt-2">
                  <Link
                    href={`/admin/products?category=${category.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <ExternalLink size={12} />
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
