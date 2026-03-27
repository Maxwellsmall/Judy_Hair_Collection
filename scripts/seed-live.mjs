/**
 * Seed script — hits the live Vercel API to create test categories and products.
 * Run with: node scripts/seed-live.mjs
 */

const BASE_URL = 'https://judy-hair-collection.vercel.app';
const EMAIL = 'admin@judyhaircollection.com';
const PASSWORD = 'JudyHair2026!';

// Sample Cloudinary-hosted hair images (public domain / free-use)
const HAIR_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80',
];

const CATEGORIES = [
  { name: 'Lace Front Wigs', slug: 'lace-front-wigs', color: '#f59e0b', description: 'Premium lace front wigs for a natural hairline look.' },
  { name: 'Closure Wigs', slug: 'closure-wigs', color: '#3b82f6', description: 'Beautiful closure wigs with natural parting.' },
  { name: 'Braided Wigs', slug: 'braided-wigs', color: '#22c55e', description: 'Stylish braided wigs for every occasion.' },
];

const PRODUCTS = [
  {
    name: 'Brazilian Body Wave Lace Front Wig',
    price: 45000,
    originalPrice: 55000,
    description: '100% human hair Brazilian body wave lace front wig. Natural looking hairline with pre-plucked baby hairs. Available in multiple lengths.',
    category: 'Lace Front Wigs',
    categorySlug: 'lace-front-wigs',
    tags: ['Straight', 'Long', 'Human Hair'],
    features: ['100% human hair', 'Pre-plucked hairline', 'Adjustable strap', 'Lace front closure', 'Can be dyed and bleached'],
    colors: ['Natural Black', 'Dark Brown'],
    sizes: ['12 inch', '14 inch', '16 inch', '18 inch', '20 inch'],
    featured: true,
    images: [HAIR_IMAGES[0], HAIR_IMAGES[1]],
  },
  {
    name: 'Peruvian Straight Closure Wig',
    price: 38000,
    originalPrice: 48000,
    description: 'Silky straight Peruvian hair closure wig. 4x4 lace closure with natural parting. Lightweight and comfortable for all-day wear.',
    category: 'Closure Wigs',
    categorySlug: 'closure-wigs',
    tags: ['Straight', 'Long'],
    features: ['Peruvian human hair', '4x4 lace closure', 'Natural parting', 'Lightweight cap', 'Tangle-free'],
    colors: ['Natural Black'],
    sizes: ['14 inch', '16 inch', '18 inch'],
    featured: true,
    images: [HAIR_IMAGES[2], HAIR_IMAGES[3]],
  },
  {
    name: 'Knotless Box Braids Wig',
    price: 28000,
    description: 'Stylish knotless box braids wig. No heat needed, ready to wear. Lightweight and protective style.',
    category: 'Braided Wigs',
    categorySlug: 'braided-wigs',
    tags: ['Bob', 'Long'],
    features: ['Knotless braids', 'Ready to wear', 'No heat needed', 'Lightweight', 'Protective style'],
    colors: ['Black', 'Dark Brown', 'Burgundy'],
    sizes: ['Medium', 'Large'],
    featured: false,
    images: [HAIR_IMAGES[4]],
  },
  {
    name: 'Deep Wave Lace Front Wig',
    price: 52000,
    originalPrice: 62000,
    description: 'Gorgeous deep wave lace front wig with bouncy curls. 13x4 lace frontal for maximum styling versatility.',
    category: 'Lace Front Wigs',
    categorySlug: 'lace-front-wigs',
    tags: ['Curly', 'Long', 'Human Hair'],
    features: ['100% human hair', '13x4 lace frontal', 'Deep wave pattern', 'Pre-plucked', 'Bleached knots'],
    colors: ['Natural Black', 'Dark Brown', '1B/30 Ombre'],
    sizes: ['16 inch', '18 inch', '20 inch', '22 inch'],
    featured: true,
    images: [HAIR_IMAGES[5], HAIR_IMAGES[0]],
  },
  {
    name: 'Straight Bob Closure Wig',
    price: 32000,
    description: 'Chic straight bob closure wig. Perfect for a sleek, professional look. Easy to style and maintain.',
    category: 'Closure Wigs',
    categorySlug: 'closure-wigs',
    tags: ['Straight', 'Bob'],
    features: ['Human hair blend', '4x4 closure', 'Bob cut', 'Easy to style', 'Natural shine'],
    colors: ['Natural Black', 'Jet Black'],
    sizes: ['10 inch', '12 inch'],
    featured: false,
    images: [HAIR_IMAGES[1], HAIR_IMAGES[2]],
  },
];

async function login() {
  console.log('🔐 Logging in...');
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(`Login failed: ${data.message}`);
  // Extract cookie from response
  const setCookie = res.headers.get('set-cookie');
  const token = setCookie?.match(/admin_session=([^;]+)/)?.[1];
  if (!token) throw new Error('No session cookie returned');
  console.log('✅ Logged in successfully');
  return token;
}

async function createCategory(token, category) {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_session=${token}` },
    body: JSON.stringify(category),
  });
  const data = await res.json();
  if (!res.ok) {
    // 409 = already exists, that's fine
    if (res.status === 409 || data.message?.includes('duplicate')) {
      console.log(`  ⚠️  Category "${category.name}" already exists, skipping`);
      return null;
    }
    throw new Error(`Failed to create category "${category.name}": ${data.message}`);
  }
  console.log(`  ✅ Created category: ${category.name}`);
  return data.data?.category;
}

async function createProduct(token, product) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_session=${token}` },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Failed to create product "${product.name}": ${data.message}`);
  console.log(`  ✅ Created product: ${product.name}`);
  return data.data?.product;
}

async function getCategories(token) {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    headers: { Cookie: `admin_session=${token}` },
  });
  const data = await res.json();
  return data.data?.categories ?? [];
}

async function getProducts(token) {
  const res = await fetch(`${BASE_URL}/api/products?limit=50`, {
    headers: { Cookie: `admin_session=${token}` },
  });
  const data = await res.json();
  return data.data?.products ?? data.products ?? [];
}

async function testFeaturedToggle(token, productId, productName) {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/featured`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_session=${token}` },
    body: JSON.stringify({ featured: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Featured toggle failed: ${data.message}`);
  console.log(`  ✅ Featured toggle works for: ${productName}`);
}

async function testProductUpdate(token, productId, productName) {
  const res = await fetch(`${BASE_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_session=${token}` },
    body: JSON.stringify({ price: 99999 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Product update failed: ${data.message}`);
  console.log(`  ✅ Product update works for: ${productName}`);
}

async function testCategoryUpdate(token, categoryId, categoryName) {
  const res = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_session=${token}` },
    body: JSON.stringify({ description: 'Updated description via seed test.' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Category update failed: ${data.message}`);
  console.log(`  ✅ Category update works for: ${categoryName}`);
}

async function main() {
  console.log(`\n🚀 Seeding ${BASE_URL}\n`);

  const token = await login();

  // --- Categories ---
  console.log('\n📁 Creating categories...');
  for (const cat of CATEGORIES) {
    await createCategory(token, cat);
  }

  const categories = await getCategories(token);
  console.log(`\n📋 ${categories.length} categories in DB`);

  // --- Products ---
  console.log('\n📦 Creating products...');
  for (const product of PRODUCTS) {
    await createProduct(token, product);
  }

  const products = await getProducts(token);
  console.log(`\n📋 ${products.length} products in DB`);

  // --- Test workflows ---
  console.log('\n🧪 Testing workflows...');

  if (products.length > 0) {
    await testFeaturedToggle(token, products[0]._id, products[0].name);
    await testProductUpdate(token, products[0]._id, products[0].name);
  }

  if (categories.length > 0) {
    await testCategoryUpdate(token, categories[0]._id, categories[0].name);
  }

  // --- Test public endpoints ---
  console.log('\n🌐 Testing public endpoints...');
  const pubProducts = await fetch(`${BASE_URL}/api/products?limit=10`).then(r => r.json());
  console.log(`  ✅ Public GET /api/products → ${pubProducts.data?.products?.length ?? pubProducts.products?.length ?? 0} products`);

  const pubCategories = await fetch(`${BASE_URL}/api/categories`).then(r => r.json());
  console.log(`  ✅ Public GET /api/categories → ${pubCategories.data?.categories?.length ?? 0} categories`);

  const featuredProducts = await fetch(`${BASE_URL}/api/products/featured`).then(r => r.json());
  console.log(`  ✅ Public GET /api/products/featured → ${featuredProducts.data?.products?.length ?? featuredProducts.products?.length ?? 0} featured products`);

  console.log('\n✅ All done! Visit https://judy-hair-collection.vercel.app to see the results.\n');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
