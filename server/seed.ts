/**
 * Seed Script for Judy Hair Collection
 * 
 * This script:
 * 1. Uploads placeholder images to Cloudinary
 * 2. Seeds the MongoDB database with initial products
 * 3. Creates categories based on products
 * 
 * Usage: npm run seed
 */

import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './config/database.js';

dotenv.config();

const { v2: cloudinaryV2 } = cloudinary;

// Sample placeholder image URLs (using placehold.co for demo)
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

// Sample products data for Judy Hair Collection
const productsData = [
  // Bundles
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
  
  // Custom Wigs
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
  
  // Hair Care
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
  
  // Accessories
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
 * Upload image to Cloudinary from URL
 */
async function uploadImageToCloudinary(imageUrl: string, folder: string): Promise<string> {
  try {
    const result = await cloudinaryV2.uploader.upload(imageUrl, {
      folder: `judy_hair/${folder}`,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
      ],
    });
    
    console.log(`✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${imageUrl}:`, error);
    // Return the original URL as fallback
    return imageUrl;
  }
}

/**
 * Main seed function
 */
async function seedDatabase() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🌱 Judy Hair Collection - Database Seeder               ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // Connect to MongoDB
    await connectDB();

    // Configure Cloudinary
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Clear existing products (optional - comment out to keep existing data)
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared\n');

    // Upload images and create products
    console.log('📦 Seeding products...\n');
    
    const seededProducts = [];
    
    for (const productData of productsData) {
      // Get images for this product's category
      const categoryImages = placeholderImages[productData.categorySlug as keyof typeof placeholderImages] || placeholderImages.bundles;
      
      // Upload images to Cloudinary
      const images = await Promise.all(
        categoryImages.map((url) => uploadImageToCloudinary(url, productData.categorySlug))
      );

      // Create product
      const product = await Product.create({
        ...productData,
        images,
      });

      seededProducts.push(product);
      console.log(`✅ Created: ${product.name}`);
    }

    console.log(`\n✅ Successfully seeded ${seededProducts.length} products!`);

    // Verify products in database
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    // Show categories
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$categorySlug',
          name: { $first: '$category' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log('\n📁 Categories created:');
    categories.forEach((cat) => {
      console.log(`   - ${cat.name}: ${cat.count} products`);
    });

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║   ✅ Database seeding completed successfully!             ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed script
seedDatabase();
