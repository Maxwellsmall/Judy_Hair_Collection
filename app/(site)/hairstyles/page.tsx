"use client";

import { useState, useEffect } from "react";
import { productsApi, Product, Category } from "../../../src/lib/api";
import ProductCard from "../../../src/components/ProductCard";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function HairstylesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch categories once
  useEffect(() => {
    productsApi.getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data.categories);
    }).catch(console.error);
  }, []);

  // Fetch products when filter/sort changes
  useEffect(() => {
    setLoading(true);
    productsApi.getAll({
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      sort: sortBy,
    }).then((res) => {
      if (res.success && res.data) setProducts(res.data.products);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy]);

  return (
    <section className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            Discover premium wigs, bundles, and hair care products crafted for elegance and confidence.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-600" />
            <span className="font-semibold text-neutral-700">Filter:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-neutral-600" />
            <span className="font-semibold text-neutral-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.images[0]}
                category={product.category as any}
                productName={product.name}
                whatsappMessage={`Hello, I'm interested in ${product.name}`}
                priceLabel={`₦${product.price.toLocaleString()}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
