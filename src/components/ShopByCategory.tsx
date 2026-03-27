"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import type { Category } from "../lib/api";
import { productsApi } from "../lib/api";

const ShopByStyle = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsApi.getCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default categories as fallback
  const defaultCategories = [
    {
      _id: "bundles",
      name: "Bundles",
      slug: "bundles",
      count: 0,
      latestImage: "",
    },
    {
      _id: "custom-wigs",
      name: "Custom Wigs",
      slug: "custom-wigs",
      count: 0,
      latestImage: "",
    },
    {
      _id: "hair-care",
      name: "Hair Care",
      slug: "hair-care",
      count: 0,
      latestImage: "",
    },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
              Shop by Category
            </h2>
            <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-neutral-100 rounded-lg h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            {error ? error : "Explore our curated collections of premium hair products"}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              description={`${category.count} products`}
              image={category.latestImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStyle;