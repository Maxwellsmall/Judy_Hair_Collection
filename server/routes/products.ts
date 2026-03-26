import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Product from '../models/Product.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

// Validation schema for product creation/update
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /api/products
 * Get all products with optional filtering and sorting
 * Query params: category, featured, sort, search, limit, page
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      featured,
      sort = 'newest',
      search,
      limit = '50',
      page = '1',
    } = req.query;

    // Build query
    const query: Record<string, unknown> = {};

    if (category) {
      query.categorySlug = category;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort options
    let sortOptions: Record<string, number> = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions as Record<string, 1 | -1>)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
    });
  }
});

/**
 * GET /api/products/featured
 * Get featured products (with fallback to newest)
 */
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 8;

    // Try to get featured products first
    let products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Fallback to newest products if no featured products
    if (products.length === 0) {
      products = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
    });
  }
});

/**
 * GET /api/products/categories
 * Get all unique categories with counts and latest image
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    // Get all unique categories with their latest product
    const categories = await Product.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$categorySlug',
          name: { $first: '$category' },
          slug: { $first: '$categorySlug' },
          count: { $sum: 1 },
          latestImage: { $first: { $arrayElemAt: ['$images', 0] } },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        categories,
        count: categories.length,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
    });
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
    });
  }
});

/**
 * POST /api/products
 * Create new product (Admin only)
 */
router.post('/', protectAdmin, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = productSchema.parse(req.body);

    // Create product
    const product = await Product.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product (Admin only)
 */
router.put('/:id', protectAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate request body (partial update)
    const validatedData = productSchema.partial().parse(req.body);

    const product = await Product.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (Admin only)
 */
router.delete('/:id', protectAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
    });
  }
});

/**
 * PATCH /api/products/:id/featured
 * Toggle featured status (Admin only)
 */
router.patch('/:id/featured', protectAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (typeof featured !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'Featured must be a boolean value',
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      message: `Product ${featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling featured status',
    });
  }
});

export default router;
