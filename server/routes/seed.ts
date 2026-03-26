import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

const router = Router();

// Sample placeholder image URLs
const placeholderImages = {
  bundles: [
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=800&fit=crop',
  ],
  wigs: [
    'https://images.unsplash.com/photo-1582095133179-bfd08d2fc6b2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1596483758362-e001c8c66c85?w=800&h=800&fit=crop',
  ],
  hairCare: [
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&h=800&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800&h=800&fit=crop',
  ],
};

const productsData = [
  {
    name: 'Brazilian Body Wave Bundle',
    description: '100% human hair body wave bundle. Natural texture with beautiful shine.',
    price: 45000,
    originalPrice: 60000,
    category: 'Bundles',
    categorySlug: 'bundles',
    sizes: ['14 inches', '16 inches', '18 inches', '20 inches'],
    colors: ['Natural Black', 'Dark Brown', 'Burgundy'],
    featured: true,
    tags: ['body wave', 'brazilian', 'human hair', 'bundles'],
  },
  {
    name: 'Peruvian Straight Bundle',
    description: 'Premium Peruvian straight hair. Silky smooth texture that lasts.',
    price: 50000,
    originalPrice: 70000,
    category: 'Bundles',
    categorySlug: 'bundles',
    sizes: ['16 inches', '18 inches', '20 inches', '22 inches'],
    colors: ['Natural Black', 'Off Black'],
    featured: true,
    tags: ['straight', 'peruvian', 'human hair', 'bundles'],
  },
  {
    name: 'Kinky Curly Bundle',
    description: 'Natural kinky curly texture. Perfect blend with natural African hair.',
    price: 40000,
    originalPrice: 55000,
    category: 'Bundles',
    categorySlug: 'bundles',
    sizes: ['12 inches', '14 inches', '16 inches', '18 inches'],
    colors: ['Natural Black', 'Dark Brown'],
    featured: false,
    tags: ['kinky curly', 'curly', 'human hair', 'bundles'],
  },
  {
    name: 'Deep Wave Bundle',
    description: 'Luxurious deep wave pattern. Voluminous and elegant.',
    price: 48000,
    originalPrice: 65000,
    category: 'Bundles',
    categorySlug: 'bundles',
    sizes: ['14 inches', '16 inches', '18 inches', '20 inches'],
    colors: ['Natural Black', 'Chocolate Brown', 'Burgundy'],
    featured: true,
    tags: ['deep wave', 'wave', 'human hair', 'bundles'],
  },
  {
    name: 'Full Lace Wig - Body Wave',
    description: 'Hand-tied full lace wig with body wave texture. Natural hairline.',
    price: 120000,
    originalPrice: 150000,
    category: 'Custom Wigs',
    categorySlug: 'custom-wigs',
    sizes: ['18 inches', '20 inches', '22 inches'],
    colors: ['Natural Black', 'Dark Brown', 'Blonde'],
    featured: true,
    tags: ['full lace', 'wig', 'body wave', 'custom'],
  },
  {
    name: '360 Lace Frontal Wig - Straight',
    description: '360 lace frontal wig with straight texture. Versatile styling.',
    price: 135000,
    originalPrice: 170000,
    category: 'Custom Wigs',
    categorySlug: 'custom-wigs',
    sizes: ['18 inches', '20 inches', '22 inches', '24 inches'],
    colors: ['Natural Black', 'Off Black', 'Brown'],
    featured: true,
    tags: ['360 lace', 'frontal', 'wig', 'straight'],
  },
  {
    name: 'Closure Wig - Kinky Curly',
    description: '4x4 closure wig with kinky curly texture. Easy to install.',
    price: 95000,
    originalPrice: 120000,
    category: 'Custom Wigs',
    categorySlug: 'custom-wigs',
    sizes: ['14 inches', '16 inches', '18 inches'],
    colors: ['Natural Black', 'Dark Brown'],
    featured: false,
    tags: ['closure', 'wig', 'kinky curly', '4x4'],
  },
  {
    name: 'HD Lace Front Wig - Deep Wave',
    description: 'Premium HD lace front wig. Undetectable hairline with deep wave pattern.',
    price: 145000,
    originalPrice: 180000,
    category: 'Custom Wigs',
    categorySlug: 'custom-wigs',
    sizes: ['18 inches', '20 inches', '22 inches'],
    colors: ['Natural Black', 'Chocolate', 'Burgundy'],
    featured: true,
    tags: ['HD lace', 'front', 'wig', 'deep wave'],
  },
  {
    name: 'Argan Oil Hair Serum',
    description: 'Nourishing argan oil serum for shiny, healthy hair.',
    price: 8500,
    originalPrice: 12000,
    category: 'Hair Care',
    categorySlug: 'hair-care',
    sizes: ['100ml'],
    colors: [],
    featured: false,
    tags: ['serum', 'argan oil', 'hair care', 'shine'],
  },
  {
    name: 'Satin Bonnet',
    description: 'Premium satin bonnet to protect your hair while sleeping.',
    price: 3500,
    originalPrice: 5000,
    category: 'Hair Care',
    categorySlug: 'hair-care',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Gold', 'Silver'],
    featured: false,
    tags: ['satin', 'bonnet', 'hair protection', 'accessories'],
  },
  {
    name: 'Edge Control Gel',
    description: 'Strong hold edge control gel for sleek edges all day.',
    price: 4500,
    originalPrice: 6000,
    category: 'Hair Care',
    categorySlug: 'hair-care',
    sizes: ['80ml'],
    colors: [],
    featured: false,
    tags: ['edge control', 'gel', 'styling', 'hair care'],
  },
  {
    name: 'Wig Shampoo & Conditioner Set',
    description: 'Gentle shampoo and conditioner specially formulated for wigs.',
    price: 12000,
    originalPrice: 16000,
    category: 'Hair Care',
    categorySlug: 'hair-care',
    sizes: ['250ml each'],
    colors: [],
    featured: false,
    tags: ['shampoo', 'conditioner', 'wig care', 'set'],
  },
  {
    name: 'Wig Stand',
    description: 'Adjustable wig stand for storage and styling.',
    price: 5000,
    originalPrice: 7000,
    category: 'Accessories',
    categorySlug: 'accessories',
    sizes: ['One Size'],
    colors: ['Black', 'White'],
    featured: false,
    tags: ['wig stand', 'storage', 'accessories'],
  },
  {
    name: 'Hair Clips Set',
    description: 'Professional hair clips for sectioning during styling.',
    price: 2500,
    originalPrice: 4000,
    category: 'Accessories',
    categorySlug: 'accessories',
    sizes: ['Set of 6'],
    colors: ['Black'],
    featured: false,
    tags: ['clips', 'styling', 'accessories'],
  },
];

/**
 * POST /api/seed
 * Seed the database with sample products
 * Protected route - admin only
 */
router.post('/', async (_req: Request, res: Response) => {
  try {
    console.log('🌱 Starting database seed...');

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    const seededProducts = [];

    for (const productData of productsData) {
      const categoryImages = placeholderImages[productData.categorySlug as keyof typeof placeholderImages] || placeholderImages.bundles;
      
      // Upload images to Cloudinary
      const uploadPromises = categoryImages.map(async (url) => {
        try {
          const result = await cloudinary.uploader.upload(url, {
            folder: `judy_hair/${productData.categorySlug}`,
            transformation: [
              { width: 800, height: 800, crop: 'fill', gravity: 'face' },
              { quality: 'auto:good' },
            ],
          });
          return result.secure_url;
        } catch (error) {
          console.error(`Failed to upload ${url}:`, error);
          return url; // Fallback to original URL
        }
      });

      const images = await Promise.all(uploadPromises);

      const product = await Product.create({
        ...productData,
        images,
      });

      seededProducts.push(product);
      console.log(`✅ Created: ${product.name}`);
    }

    console.log(`✅ Successfully seeded ${seededProducts.length} products!`);

    res.json({
      success: true,
      message: `Database seeded successfully with ${seededProducts.length} products`,
      data: {
        count: seededProducts.length,
        products: seededProducts.map(p => ({ name: p.name, category: p.category })),
      },
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/seed/status
 * Check database status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const productCount = await Product.countDocuments();
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$categorySlug',
          name: { $first: '$category' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        productCount,
        categories: categories.map(c => ({ name: c.name, count: c.count })),
        isSeeded: productCount > 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
