"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productsApi, Product, Category as CategoryType } from "../../../src/lib/api";
import ProductCard from "../../../src/components/ProductCard";

function CategoryContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await productsApi.getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories);
        }

        // Fetch products for this category
        if (categorySlug) {
          const productsResponse = await productsApi.getAll({ category: categorySlug });
          if (productsResponse.success && productsResponse.data) {
            setProducts(productsResponse.data.products);
            const category = categoriesResponse.data?.categories.find(c => c.slug === categorySlug);
            if (category) {
              setCategoryName(category.name);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  return (
    <section className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 mb-4">
            {categoryName || "All Categories"}
          </h1>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            {categoryName 
              ? `Browse our selection of ${categoryName.toLowerCase()}`
              : "Explore all our premium hair products"}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setCategoryName("All")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              !categorySlug
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/category?category=${category.slug}`}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                categorySlug === category.slug
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {category.name} ({category.count})
            </a>
          ))}
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

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
