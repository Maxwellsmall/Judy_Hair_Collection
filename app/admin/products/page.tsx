"use client";

import { useState, useEffect } from "react";
import { productsApi, Product } from "../../../src/lib/api";
import { Pencil, Trash2, Eye, EyeOff, Plus } from "lucide-react";



export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll({ limit: 100 });
      if (response.success && response.data) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await productsApi.delete(id);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await productsApi.toggleFeatured(id, !featured);
      if (response.success) {
        setProducts(
          products.map((p) =>
            p._id === id ? { ...p, featured: !featured } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">
            Products
          </h1>
          <p className="text-neutral-600 font-body mt-2">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No Products Yet
          </h3>
          <p className="text-neutral-600 mb-6">
            Start by adding your first product
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-neutral-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Product
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Price
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-neutral-700">
                  Featured
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {product.sizes.join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {product.category}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-neutral-900">
                      ₦{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-neutral-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() =>
                        handleToggleFeatured(product._id, product.featured)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        product.featured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                      }`}
                      title={
                        product.featured ? "Remove from featured" : "Add to featured"
                      }
                    >
                      {product.featured ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold font-heading">Add Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 text-center py-8">
                Product creation form coming soon...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
