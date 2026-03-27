'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { categoriesApi, productsApi } from '../../../src/lib/api';
import type { CategoryModel, Product } from '../../../src/lib/api';
import CategoryCard from '../components/CategoryCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoriesApi.getAll(),
        productsApi.getAll({ limit: 200 }),
      ]);
      setCategories(catRes.data?.categories ?? []);
      setProducts(prodRes.data?.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function getProductCount(categorySlug: string): number {
    return products.filter((p) => p.categorySlug === categorySlug).length;
  }

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c._id !== id));
    toast.success('Category deleted');
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      {/* Content */}
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
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            <Plus size={14} />
            Add your first category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              productCount={getProductCount(category.slug)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
