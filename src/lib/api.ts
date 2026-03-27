// API Client for Judy Hair Collection Backend
// This provides a clean interface for the frontend to interact with the backend
// Uses relative URLs for Next.js API routes

const API_BASE_URL = '/api';

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  sizes: string[];
  colors?: string[];
  images: string[];
  featured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
  latestImage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  colors?: string[];
  images: string[];
  featured?: boolean;
  tags?: string[];
}

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product APIs
export const productsApi = {
  // Get all products
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    sort?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<{ products: Product[]; pagination: Record<string, unknown> }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/products?${queryParams.toString()}`);
  },

  // Get featured products
  getFeatured: async (limit?: number): Promise<ApiResponse<{ products: Product[]; count: number }>> => {
    return apiRequest(`/products/featured${limit ? `?limit=${limit}` : ''}`);
  },

  // Get categories
  getCategories: async (): Promise<ApiResponse<{ categories: Category[]; count: number }>> => {
    return apiRequest('/products/categories');
  },

  // Get single product
  getById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    return apiRequest(`/products/${id}`);
  },

  // Create product (Admin)
  create: async (product: ProductInput): Promise<ApiResponse<{ product: Product }>> => {
    return apiRequest('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
  },

  // Update product (Admin)
  update: async (id: string, product: Partial<ProductInput>): Promise<ApiResponse<{ product: Product }>> => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
  },

  // Delete product (Admin)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle featured status (Admin)
  toggleFeatured: async (id: string, featured: boolean): Promise<ApiResponse<{ product: Product }>> => {
    return apiRequest(`/products/${id}/featured`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ featured }),
    });
  },
};

// Auth APIs
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ email: string; expiresAt: string }>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Get current session
  getSession: async (): Promise<ApiResponse<{ email: string; isAdmin: boolean }>> => {
    return apiRequest('/auth/me');
  },
};

// Upload APIs
export const uploadApi = {
  // Upload single image
  uploadSingle: async (file: File): Promise<ApiResponse<{ url: string; publicId: string; secureUrl: string }>> => {
    const formData = new FormData();
    formData.append('image', file);

    return apiRequest('/upload/single', {
      method: 'POST',
      body: formData,
    });
  },

  // Upload multiple images
  uploadMultiple: async (files: File[]): Promise<ApiResponse<{ images: Array<{ url: string; publicId: string; secureUrl: string }>; count: number }>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    return apiRequest('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  },

  // Delete image
  deleteImage: async (publicId: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/upload/${publicId}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiRequest('/health');
};
