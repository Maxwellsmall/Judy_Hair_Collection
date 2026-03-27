"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { ProductCardProps } from "./ProductCard";
import { WhatsAppMessages } from "../lib/whatsapp";
import type { Product } from "../lib/api";
import { productsApi } from "../lib/api";

interface ProductGalleryProps {
  title?: string;
  subtitle?: string;
  categoryFilter?: string;
  featuredOnly?: boolean;
}

/**
 * ProductGallery Component
 *
 * Displays a grid of products fetched from the API.
 * Optionally filter by category or featured status.
 */
const ProductGallery = ({
  title = "Featured Collection",
  subtitle = "Explore our premium selection of wigs, bundles, and hair care products",
  categoryFilter,
  featuredOnly = false,
}: ProductGalleryProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({
          category: categoryFilter,
          featured: featuredOnly ? true : undefined,
          limit: 6,
        });
        
        if (response.success && response.data) {
          const productCards: ProductCardProps[] = response.data.products.map((product: Product) => ({
            id: product._id,
            image: product.images[0] || "",
            category: product.category,
            productName: product.name,
            whatsappMessage: WhatsAppMessages.productInquiry(product.name),
            priceLabel: `₦${product.price.toLocaleString()}`,
          }));
          setProducts(productCards);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, featuredOnly]);

  if (loading) {
    return (
      <section id="products" className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
              {title}
            </h2>
            <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
              Loading products...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-xl h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 sm:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            {title}
          </h2>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            {error ? error : subtitle}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 font-body">
            {error || "No products found in this category."}
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
