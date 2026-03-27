'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../../../src/lib/api';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import AdminProductSearch from '../components/AdminProductSearch';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const searchQuery = searchParams.get('search') ?? '';
  const categoryParam = searchParams.get('category') ?? 'all';

  // Sync activeCategory from URL on mount and when URL changes
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products?limit=200', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      setProducts(json.data?.products ?? json.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Derive unique category slugs from products
  const categories = Array.from(
    new Set(products.map((p) => p.categorySlug).filter(Boolean))
  );

  // Client-side filtering
  const filtered = products.filter((p) => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      activeCategory === 'all' ? true : p.categorySlug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.success('Product deleted');
  }

  function handleFeaturedChange(id: string, featured: boolean) {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, featured } : p))
    );
  }

  function handleCategoryClick(slug: string) {
    setActiveCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminProductSearch defaultValue={searchQuery} />
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="sticky top-0 z-10 bg-neutral-50 -mx-6 px-6 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All
          </button>
          {categories.map((slug) => {
            const label = products.find((p) => p.categorySlug === slug)?.category ?? slug;
            return (
              <button
                key={slug}
                onClick={() => handleCategoryClick(slug)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === slug
                    ? 'bg-neutral-900 text-white'
                    : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-12 text-center space-y-3">
          <Package size={40} className="mx-auto text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">
            {products.length === 0 ? 'No products yet' : 'No products match your filters'}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus size={14} />
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
              onFeaturedChange={handleFeaturedChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
