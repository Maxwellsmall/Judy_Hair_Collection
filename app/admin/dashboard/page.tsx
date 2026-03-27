"use client";

import { useState, useEffect } from "react";
import { productsApi } from "../../../src/lib/api";
import { Package, TrendingUp, DollarSign, Eye } from "lucide-react";



export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getAll({ limit: 1 }),
          productsApi.getCategories(),
        ]);

        if (productsResponse.success && categoriesResponse.success) {
          const featuredResponse = await productsApi.getFeatured(100);
          
          setStats({
            totalProducts: Number(productsResponse.data?.pagination?.total) || 0,
            totalCategories: Number(categoriesResponse.data?.count) || 0,
            featuredProducts: Number(featuredResponse.data?.count) || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Featured Products",
      value: stats.featuredProducts,
      icon: Eye,
      color: "bg-amber-500",
    },
    {
      title: "Revenue",
      value: "₦0",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-neutral-900">
          Dashboard
        </h1>
        <p className="text-neutral-600 font-body mt-2">
          Welcome to the admin dashboard
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold font-heading mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-semibold text-neutral-900">Manage Products</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Add, edit, or delete products
            </p>
          </a>
          <a
            href="/admin/upload"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-semibold text-neutral-900">Upload Images</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Upload product images to Cloudinary
            </p>
          </a>
          <a
            href="/admin/settings"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-semibold text-neutral-900">Settings</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Configure store settings
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
