# BridAfriPride Design - Product Specification Document

**Version:** 1.0  
**Last Updated:** March 25, 2026  
**Document Type:** Product Specification (Open Spec Format)  
**Status:** In Production

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [User Personas](#3-user-personas)
4. [User Flows](#4-user-flows)
5. [Information Architecture](#5-information-architecture)
6. [UI/UX Architecture](#6-uiux-architecture)
7. [Feature Specifications](#7-feature-specifications)
8. [Technical Architecture](#8-technical-architecture)
9. [Design System](#9-design-system)
10. [Success Metrics](#10-success-metrics)

---

## 1. Executive Summary

### 1.1 Product Overview

**BridAfriPride Design** is a premium e-commerce platform specializing in luxury shoes and designer bags for the modern African lifestyle. The platform provides a seamless shopping experience with a visually stunning storefront and a robust admin dashboard for inventory management.

### 1.2 Value Proposition

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Customers** | Curated premium footwear and accessories with intuitive browsing, detailed product information, and secure shopping experience |
| **Administrators** | Streamlined product management with real-time inventory control, dynamic categorization, and one-click featuring capabilities |
| **Business** | Scalable e-commerce infrastructure with automated content management, SEO-optimized architecture, and brand-consistent presentation |

### 1.3 Key Differentiators

- **Dynamic Category System**: Categories auto-populate based on product inventory—no manual category management required
- **Smart Featured Products**: Automatic fallback to newest products when no manual featuring is configured
- **Image-First Design**: Category thumbnails automatically pull from the latest product image in each category
- **Mobile-First Responsive Design**: Optimized for 60%+ mobile traffic in African markets

---

## 2. Product Vision

### 2.1 Vision Statement

> To become the premier destination for luxury footwear and designer bags in Africa, providing an exceptional digital shopping experience that reflects the sophistication and style of the modern African consumer.

### 2.2 Mission

Deliver a world-class e-commerce platform that:
- Showcases premium products with editorial-quality presentation
- Simplifies product discovery through intelligent categorization
- Empowers business owners with intuitive content management tools
- Scales seamlessly with business growth

### 2.3 Strategic Goals (12-Month)

| Goal | Target | Current Baseline |
|------|--------|------------------|
| Monthly Active Users | 50,000 | TBD |
| Conversion Rate | 3.5% | TBD |
| Product Catalog Size | 500 SKUs | TBD |
| Admin Task Completion Time | <2 min/product | Manual benchmark |
| Mobile Page Load Time | <3 seconds | TBD |

### 2.4 Non-Goals

The following are explicitly **out of scope** for this version:

- Shopping cart and checkout functionality (Phase 2)
- User accounts and wishlists (Phase 2)
- Payment gateway integration (Phase 2)
- Multi-vendor marketplace capabilities (Phase 3)
- International shipping calculations (Phase 2)
- Customer reviews and ratings (Phase 2)

---

## 3. User Personas

### 3.1 Primary Personas

#### Persona 1: Chioma - The Style-Conscious Professional

![Chioma](https://placehold.co/200x200/f5f5f5/171717?text=Chioma)

| Attribute | Details |
|-----------|---------|
| **Demographics** | Female, 28-40, Urban Lagos/Abuja |
| **Occupation** | Corporate Professional, Entrepreneur |
| **Income** | ₦500,000 - ₦2,000,000/month |
| **Tech Savviness** | High (smartphone-first user) |
| **Shopping Behavior** | Quality-focused, brand-conscious, willing to pay premium for authenticity |

**Goals:**
- Find authentic, high-quality designer bags and shoes
- Complete shopping experience quickly during lunch breaks or evenings
- Verify product details (sizes, materials, colors) before purchase

**Frustrations:**
- Fake products on existing marketplaces
- Poor product photography that hides details
- Complicated navigation requiring multiple clicks
- Slow mobile loading times

**Quote:**
> "I want to shop with confidence, knowing I'm getting genuine quality. I don't have time to scroll through endless low-quality listings."

---

#### Persona 2: Tunde - The Gift Shopper

![Tunde](https://placehold.co/200x200/f5f5f5/171717?text=Tunde)

| Attribute | Details |
|-----------|---------|
| **Demographics** | Male, 30-45, Urban Nigeria/Diaspora |
| **Occupation** | Business Owner, Tech Professional |
| **Income** | ₦800,000 - ₦3,000,000/month |
| **Tech Savviness** | Medium-High |
| **Shopping Behavior** | Occasional shopper, values convenience and presentation |

**Goals:**
- Find impressive gifts for special occasions (anniversaries, birthdays)
- Get products delivered reliably
- Understand sizing and style recommendations

**Frustrations:**
- Unclear product descriptions
- No size guides or recommendations
- Complicated return policies

**Quote:**
> "I want to buy something special for my wife. Make it easy for me to choose the right thing."

---

### 3.2 Secondary Personas

#### Persona 3: Admin - Benedicta (Business Owner)

| Attribute | Details |
|-----------|---------|
| **Role** | Business Owner / Inventory Manager |
| **Tech Comfort** | Medium (comfortable with basic web interfaces) |
| **Primary Tasks** | Add products, update prices, manage inventory, feature promotions |
| **Time Available** | 30-60 minutes/day for admin tasks |
| **Success Metric** | Time to list new products, accuracy of inventory |

**Goals:**
- Add new products quickly (under 2 minutes per product)
- Easily highlight promotional items
- Track which products are performing well
- Manage inventory without technical complexity

**Frustrations:**
- Complex admin interfaces requiring training
- Manual category management
- Uploading images one at a time
- Unclear error messages

**Quote:**
> "I just want to add my products and see them look beautiful on the site. I don't have time to learn complicated systems."

---

### 3.3 User Needs Hierarchy

```
                    ┌─────────────────┐
                    │   DELIGHTFUL    │  ← Personalized recommendations
                    │  (Aspirational) │     Smooth animations
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    EFFICIENT    │  ← Quick product search
                    │   (Performance) │     Fast checkout
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     RELIABLE    │  ← Accurate product info
                    │   (Functional)  │     Working links
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │      BASIC      │  ← Product browsing
                    │   (Existence)   │     Category filtering
                    └─────────────────┘
```

---

## 4. User Flows

### 4.1 Customer User Flows

#### Flow 1: Browse Products by Category

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOMEPAGE LANDING                            │
│  - Hero banner with promotional messaging                       │
│  - "Shop by Category" section (auto-generated)                  │
│  - Featured Products carousel                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User clicks category card    │
         │  (e.g., "Designer Bags")      │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CATEGORY LISTING PAGE                         │
│  - Filtered product grid (all items in category)                │
│  - Category header with description                             │
│  - Sort options (Newest, Price: Low-High, Price: High-Low)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User clicks product card     │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCT DETAIL PAGE                           │
│  - High-resolution image gallery                                │
│  - Product name, price, description                             │
│  - Size/color selectors (if applicable)                         │
│  - "Add to Cart" / "Contact to Purchase" CTA                    │
│  - Related products section                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Success Criteria:**
- User reaches product detail page in ≤3 clicks from homepage
- Category page loads in <2 seconds
- All product images render correctly on first load

---

#### Flow 2: Search for Specific Product

```
┌─────────────────────────────────────────────────────────────────┐
│                      ANY PAGE                                   │
│  - Header with search icon visible                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User clicks search icon      │
         │  Enters query (e.g., "heels") │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SEARCH RESULTS PAGE                           │
│  - Matching products grid                                       │
│  - "No results" fallback with suggestions                       │
│  - Filter by category, price range                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User selects product         │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCT DETAIL PAGE                           │
└─────────────────────────────────────────────────────────────────┘
```

**Edge Cases:**
- No search results → Show "Try these instead" with featured products
- Typo in search → Implement fuzzy matching (Phase 2)
- Single character search → Show "Please enter at least 2 characters"

---

#### Flow 3: Mobile Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                   MOBILE HEADER                                 │
│  [Logo]                          [Hamburger Menu]               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User taps hamburger menu     │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MOBILE NAV DRAWER                             │
│  - Full-screen overlay                                          │
│  - Navigation items (Home, Products, About, Contact)            │
│  - Large touch targets (min 44px)                               │
│  - Active page highlighted                                      │
│  - [X] close button in top-right                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  User taps navigation item    │
         │  Drawer closes automatically  │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TARGET PAGE LOADS                             │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile-Specific Requirements:**
- Hamburger menu accessible within thumb zone (bottom 2/3 of screen)
- Drawer animation: slide-in from right, 300ms ease-out
- Back button support (Android hardware back, iOS swipe gesture)
- No horizontal scroll at any viewport

---

### 4.2 Admin User Flows

#### Flow 4: Add New Product

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                               │
│  - Product grid with existing inventory                         │
│  - Category filter pills at top                                 │
│  - "Add Product" button (top-right)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Admin clicks "Add Product"   │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 NEW PRODUCT FORM                                │
│  - Product Name (required, max 100 chars)                       │
│  - Description (optional, max 500 chars)                        │
│  - Price (required, numeric, min 0)                             │
│  - Category (dropdown + "Create New" option)                    │
│  - Sizes (multi-select chips)                                   │
│  - Images (drag-drop upload, min 1, max 10)                     │
│  - [Cancel] [Create Product] buttons                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Admin fills form & submits   │
         └───────────────┬───────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
     ┌─────────────────┐   ┌─────────────────┐
     │  VALIDATION     │   │  VALIDATION     │
     │  PASSES ✓       │   │  FAILS ✗        │
     └────────┬────────┘   └────────┬────────┘
              │                     │
              ▼                     ▼
     ┌─────────────────┐   ┌─────────────────┐
     │  Upload images  │   │  Show inline    │
     │  to Cloudinary  │   │  error messages │
     └────────┬────────┘   │  - Red borders  │
              │            │  - Helper text  │
              ▼            └─────────────────┘
     ┌─────────────────┐
     │  Create MongoDB │
     │  document       │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │  Success toast  │
     │  "Product       │
     │  created!"      │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │  Redirect to    │
     │  Admin Dashboard│
     └─────────────────┘
```

**Time Target:** <2 minutes for complete product addition  
**Error Handling:**
- Network failure during upload → Retry automatically (3 attempts)
- Invalid file type → Show "Only JPG, PNG, WebP allowed"
- File too large (>10MB) → Show "Image must be under 10MB"

---

#### Flow 5: Feature/Unfeature Product

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                               │
│  - Each product card has star icon (top-right)                  │
│  - Star states:                                                 │
│    ★ Yellow (filled) = Featured                                 │
│    ☆ Gray (outline) = Not Featured                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Admin clicks star icon       │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              OPTIMISTIC UI UPDATE                               │
│  - Star icon toggles immediately (no loading state)             │
│  - Background API call to update MongoDB                        │
│  - Toast notification: "Updated featured status"                │
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
     ┌─────────────────┐   ┌─────────────────┐
     │  API SUCCESS ✓  │   │  API FAIL ✗     │
     │  (silent)       │   │  Revert UI      │
     │                 │   │  Show error     │
     └─────────────────┘   │  "Try again"    │
                           └─────────────────┘
```

**Homepage Impact:**
- Featured products appear in "Featured Products" section
- If NO products are featured → Auto-show 4 newest products
- Update reflects on homepage within 1 page refresh

---

#### Flow 6: Filter Products by Category

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                               │
│  - Sticky category filter bar below header                      │
│  - Filter pills: [All Products] [Bags] [Shoes] [+ New]          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Admin clicks category pill   │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              FILTERED PRODUCT GRID                              │
│  - URL updates: /admin?category=bags                            │
│  - Active pill highlighted (dark background)                    │
│  - Product grid re-renders with filtered items                  │
│  - "X products found" count updates                             │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Admin clicks "All Products"  │
         │  or different category        │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEW FILTER APPLIED                                 │
│  - Filter state persists across page refresh                    │
│  - Bookmarkable URL with category parameter                     │
└─────────────────────────────────────────────────────────────────┘
```

**Performance:**
- Filter response: <500ms (client-side filtering)
- Support 1000+ products without lag

---

#### Flow 7: Admin Login & Session Management

```
┌─────────────────────────────────────────────────────────────────┐
│                   /admin (any page)                             │
│  - Middleware checks for admin_session cookie                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
     ┌─────────────────┐   ┌─────────────────┐
     │  Session Valid  │   │  No Session     │
     │  ✓              │   │  ✗              │
     └────────┬────────┘   └────────┬────────┘
              │                     │
              │                     ▼
              │            ┌─────────────────┐
              │            │  Redirect to    │
              │            │  /admin/login   │
              │            └────────┬────────┘
              │                     │
              │                     ▼
              │            ┌─────────────────┐
              │            │  Login Form     │
              │            │  - Email        │
              │            │  - Password     │
              │            │  - [Login] btn  │
              │            └────────┬────────┘
              │                     │
              │                     ▼
              │            ┌─────────────────┐
              │            │  Validate creds │
              │            │  against .env   │
              │            └────────┬────────┘
              │                     │
              │          ┌──────────┴──────────┐
              │          │                     │
              │          ▼                     ▼
              │   ┌─────────────┐     ┌─────────────┐
              │   │  Valid ✓    │     │  Invalid ✗  │
              │   └─────┬───────┘     └─────┬───────┘
              │         │                   │
              │         ▼                   ▼
              │   ┌─────────────┐   ┌─────────────┐
              │   │  Set cookie │   │  Show error │
              │   │  (7 days)   │   │  "Invalid   │
              │   │  Redirect   │   │  credentials│
              │   │  to /admin  │   │  Try again" │
              │   └─────────────┘   └─────────────┘
              │
              ▼
     ┌─────────────────┐
     │  Admin Dashboard│
     │  (full access)  │
     └─────────────────┘
```

**Session Details:**
- Cookie name: `admin_session`
- Expiry: 7 days from login
- Path: `/` (site-wide)
- Secure: true (HTTPS only in production)
- HttpOnly: true (no JavaScript access)
- SameSite: Strict

---

## 5. Information Architecture

### 5.1 Site Map

```
BridAfriPride Design
│
├── / (Homepage)
│   ├── Hero Section
│   ├── Shop by Category
│   ├── Featured Products
│   └── Newsletter Signup
│
├── /products (All Products)
│   ├── ?category=bags (Filtered)
│   ├── ?category=shoes (Filtered)
│   └── /[id] (Product Detail Page)
│       └── Related Products
│
├── /about
│   ├── Brand Story
│   ├── Quality Promise
│   └── Contact Information
│
├── /contact
│   ├── Contact Form
│   ├── Store Location
│   ├── Shipping Info
│   ├── Returns Policy
│   └── FAQ
│
└── /admin (Admin Dashboard - Protected)
    ├── /login (Admin Login)
    ├── / (Product Management)
    │   ├── ?category=bags (Filtered View)
    │   └── /[id]/edit (Edit Product)
    ├── /products/new (Add Product)
    ├── /categories (Category Management - Phase 2)
    └── /fix-categories (Debug Tool)
```

### 5.2 URL Structure

| Page Type | URL Pattern | Example | Notes |
|-----------|-------------|---------|-------|
| Homepage | `/` | `/` | Static landing page |
| Product Listing | `/products` | `/products` | All products grid |
| Category Filter | `/products?category={slug}` | `/products?category=bags` | Query param filtering |
| Product Detail | `/products/[id]` | `/products/67e2a1b2c3d4e5f6a7b8c9d0` | MongoDB ObjectId |
| About | `/about` | `/about` | Static content |
| Contact | `/contact` | `/contact` | Static content + form |
| Admin Dashboard | `/admin` | `/admin` | Protected route |
| Admin Login | `/admin/login` | `/admin/login` | Public (login form) |
| Add Product | `/admin/products/new` | `/admin/products/new` | Protected form |
| Edit Product | `/admin/products/[id]/edit` | `/admin/products/.../edit` | Protected form |

### 5.3 Content Hierarchy

```
Homepage (Priority 1)
├── Hero Banner (Above Fold)
│   └── Primary CTA: "Shop Now" → /products
├── Shop by Category (Priority 2)
│   └── Category Cards → /products?category={slug}
├── Featured Products (Priority 2)
│   └── Product Cards → /products/[id]
└── Newsletter (Priority 3)
    └── Email Capture → Mailing list

Product Listing (Priority 1)
├── Filter/Sort Bar (Sticky)
├── Product Grid (Responsive)
│   └── Product Cards → /products/[id]
└── Pagination/Load More (Phase 2)

Product Detail (Priority 1)
├── Image Gallery (Above Fold)
├── Product Info
│   ├── Title, Price
│   ├── Size/Color Selectors
│   └── CTA: "Add to Cart" / "Contact"
├── Description & Features
└── Related Products
```

### 5.4 Navigation Structure

#### Primary Navigation (Header)

| Label | Destination | Mobile Priority |
|-------|-------------|-----------------|
| Home | `/` | 1 |
| Products | `/products` | 1 |
| About | `/about` | 2 |
| Contact | `/contact` | 2 |

**Mobile:** Hamburger menu → Full-screen drawer  
**Desktop:** Horizontal nav bar (right-aligned)

#### Secondary Navigation (Footer)

| Section | Links |
|---------|-------|
| Quick Links | Home, Products, About Us, Contact |
| Customer Service | Shipping Info, Returns, FAQ, Support |
| Connect | Instagram, Facebook, Twitter, Newsletter |
| Branding | Logo, Tagline, Business Info |

---

## 6. UI/UX Architecture

### 6.1 Component Hierarchy

```
Root Layout
├── Header (Sticky)
│   ├── Logo (Link to /)
│   ├── Primary Nav (Desktop)
│   └── Hamburger Menu (Mobile)
│       └── Mobile Nav Drawer
│
├── Page Content
│   │
│   ├── Homepage
│   │   ├── Hero Section
│   │   ├── ShopByCategory
│   │   │   └── CategoryCard (×3)
│   │   ├── FeaturedProducts
│   │   │   └── ProductGrid
│   │   │       └── ProductCard (×4-8)
│   │   └── Newsletter
│   │
│   ├── Products Listing
│   │   ├── CategoryFilterBar (Sticky)
│   │   └── ProductGrid
│   │       └── ProductCard (×N)
│   │
│   └── Product Detail
│       ├── ImageGallery
│       ├── ProductInfo
│       │   ├── Title, Price
│       │   ├── SizeSelector
│       │   └── AddToCartButton
│       ├── ProductDescription
│       └── RelatedProducts
│           └── ProductGrid
│
└── Footer
    ├── Logo & Tagline
    ├── QuickLinks
    ├── CustomerService
    └── SocialLinks
```

### 6.2 Page Layouts

#### Homepage Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
│  [Logo]                    [Home] [Products] [About] [☰]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    HERO SECTION                             │
│         [Background Image with Overlay]                     │
│                                                             │
│              "Luxury Collection"                            │
│              "Up to 40% Off"                                │
│         [Shop Now]  [Learn More]                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              SHOP BY CATEGORY                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │              │  │              │  │              │      │
│  │   [Image]    │  │   [Image]    │  │   [Image]    │      │
│  │   Bags       │  │   Shoes      │  │   + New      │      │
│  │   [Shop →]   │  │   [Shop →]   │  │              │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              FEATURED PRODUCTS                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │  │ [Image]  │   │
│  │ Name     │  │ Name     │  │ Name     │  │ Name     │   │
│  │ ₦XX,XXX  │  │ ₦XX,XXX  │  │ ₦XX,XXX  │  │ ₦XX,XXX  │   │
│  │ [View →] │  │ [View →] │  │ [View →] │  │ [View →] │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              NEWSLETTER                                     │
│         "Subscribe for exclusive offers"                    │
│         [Email Input]  [Subscribe]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                              │
│  [Logo]  [Quick Links]  [Customer Service]  [Social]        │
│  © 2026 BridAfriPride Design. All rights reserved.          │
└─────────────────────────────────────────────────────────────┘
```

#### Product Detail Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    PRODUCT NAME                       │
│  │                 │    ₦XX,XXX                            │
│  │                 │                                       │
│  │   [Main Image]  │    [Size: M] [L] [XL]                 │
│  │                 │    [Color: Black ▼]                   │
│  │                 │                                       │
│  │   [Thumbnails]  │    [Add to Cart / Contact]            │
│  │                 │                                       │
│  └─────────────────┘    ✓ In Stock                         │
│                         ✓ Free Shipping                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DESCRIPTION                                               │
│  Crafted from premium Italian leather...                   │
│                                                             │
│  FEATURES                                                  │
│  • Premium Italian leather construction                    │
│  • Gold-tone hardware accents                              │
│  • Multiple interior pockets                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  YOU MAY ALSO LIKE                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │  │ [Image]  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                              │
└─────────────────────────────────────────────────────────────┘
```

#### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN HEADER                                               │
│  [Dashboard]  [Products]  [Categories]  [Logout]            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Products                                    [+ Add Product]│
│  Manage your store inventory                                │
│                                                             │
│  [Search Products...                            ]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Filter] [All Products] [Bags] [Shoes] [+ New]             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Product Image]              ★ [Edit] [🗑]         │   │
│  │  Product Name                                       │   │
│  │  ₦XX,XXX                                            │   │
│  │  [Category Badge]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Product Image]              ☆ [Edit] [🗑]         │   │
│  │  Product Name                                       │   │
│  │  ₦XX,XXX                                            │   │
│  │  [Category Badge]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  (Grid continues...)                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Responsive Breakpoints

| Breakpoint | Width Range | Layout Changes |
|------------|-------------|----------------|
| Mobile | 0 - 639px | Single column, hamburger menu, stacked cards |
| Tablet | 640px - 1023px | 2-column product grid, visible nav |
| Desktop | 1024px - 1279px | 3-column grid, full navigation |
| Large Desktop | 1280px+ | 4-column grid, expanded whitespace |

### 6.4 Interaction Patterns

#### Hover States

| Element | Default | Hover | Transition |
|---------|---------|-------|------------|
| Primary Button | `bg-neutral-900` | `bg-neutral-800` | 150ms ease |
| Secondary Button | `bg-white` | `bg-neutral-50` | 150ms ease |
| Product Card | `shadow-sm` | `shadow-md` | 200ms ease |
| Category Card | `scale-100` | `scale-105` (image) | 300ms ease-out |
| Nav Link | `text-neutral-700` | `text-amber-600` | 100ms ease |
| Active Nav Link | `text-amber-700 underline` | — | — |

#### Loading States

| Action | Loading Indicator | Fallback |
|--------|-------------------|----------|
| Page Load | Skeleton screens | Progressive enhancement |
| Image Load | Blurhash placeholder | Gray background |
| Form Submit | Button spinner | Disabled state |
| Filter Change | Instant (client-side) | — |
| Admin Action | Toast with spinner | Optimistic UI update |

#### Error States

| Scenario | UI Treatment | Recovery |
|----------|--------------|----------|
| Network Error | Red banner with retry button | Auto-retry (3x) |
| Invalid Form | Red borders + inline messages | Focus first error |
| Product Not Found | 404 page with "Back to Products" | Suggest alternatives |
| Image Load Fail | Gray placeholder with alt text | Retry on hover |
| Admin Auth Fail | Redirect to login + toast | Preserve return URL |

---

## 7. Feature Specifications

### 7.1 Homepage Features

#### 7.1.1 Hero Section

**Purpose:** Capture attention, communicate brand value, drive to product browsing

**Requirements:**
- Full-width background image with dark overlay (opacity 80%)
- Centered headline: "Luxury Collection" (4xl-6xl font)
- Subheadline: "Up to 40% Off" (3xl-5xl font, bold)
- Supporting text: "Discover premium bags and shoes..."
- Two CTAs:
  - Primary: "Shop Now" → `/products` (dark bg, white text)
  - Secondary: "Learn More" → `/about` (white bg, dark text)

**Responsive Behavior:**
- Mobile: Stack buttons vertically, reduce font sizes
- Tablet+: Side-by-side buttons

**Performance:**
- Hero image: Lazy load with priority hint
- Text: Server-rendered (no flash of unstyled content)

---

#### 7.1.2 Shop by Category

**Purpose:** Enable quick category-based navigation

**Data Source:** Dynamic (pulled from product catalog) + fallback static categories

**Logic:**
```typescript
// Pseudo-code for category determination
const uniqueCategories = getAllProducts()
  .map(p => ({ name: p.category, slug: p.categorySlug }))
  .deduplicate()

// If no products exist, use static fallback
const displayCategories = uniqueCategories.length > 0
  ? uniqueCategories
  : staticCategories

// Category image = first image of newest product in category
const categoryImage = getNewestProduct(categorySlug)
  ?.images[0] || staticCategory.image
```

**UI Components:**
- Section title: "Shop by Category"
- Subtitle: "Explore our curated collections"
- Grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Category Card:
  - Aspect ratio: 4:3 (mobile), 2:1 (desktop)
  - Background image with dark overlay (40%)
  - Category name (bottom-left, white text)
  - "Shop {Name}" CTA with arrow icon

**Interactions:**
- Hover: Image scale 105%, overlay lightens to 30%
- Click: Navigate to `/products?category={slug}`

---

#### 7.1.3 Featured Products

**Purpose:** Highlight promotional or high-margin items

**Data Logic:**
```typescript
// Priority 1: Manually featured products
const featured = getProducts({ featured: true })

// Fallback: 4 newest products if none featured
const displayProducts = featured.length > 0
  ? featured.slice(0, 8)
  : getProducts({ sortBy: 'newest' }).slice(0, 4)
```

**UI Components:**
- Section title: "Featured Products" (optional, can be hidden)
- Grid: 2 col (mobile) → 4 col (desktop)
- Product Card:
  - Square aspect ratio image
  - Product name (truncated)
  - Price (bold, large)
  - "View" button with arrow icon

---

#### 7.1.4 Newsletter Signup

**Purpose:** Capture emails for marketing

**UI Components:**
- Headline: "Subscribe for exclusive offers"
- Email input field
- "Subscribe" button
- Success message (toast or inline)

**Phase 2 Enhancements:**
- Double opt-in email flow
- GDPR consent checkbox
- Integration with Mailchimp/SendGrid

---

### 7.2 Product Listing Features

#### 7.2.1 Product Grid

**Layout:**
- Responsive grid: 2 col (mobile) → 3 col (tablet) → 4 col (desktop)
- Gap: 24px (mobile) → 32px (desktop)
- Card aspect ratio: Square image, flexible content area

**Product Card Anatomy:**
```
┌─────────────────────────┐
│                         │
│     [Product Image]     │
│      (Square, cover)    │
│                         │
├─────────────────────────┤
│  Product Name           │
│  (2 lines max, ellipsis)│
│                         │
│  ₦XX,XXX                │
│  (Bold, large)          │
│                         │
│  [View →]               │
│  (Small button)         │
└─────────────────────────┘
```

**States:**
- Default: White bg, subtle shadow
- Hover: Shadow increases, image scales 102%
- Loading: Skeleton placeholder
- Out of Stock: "Out of Stock" badge (Phase 2)

---

#### 7.2.2 Category Filtering (Sticky Bar)

**Purpose:** Allow admins/customers to filter by category

**Admin Version:**
- Sticky positioning (below header)
- Filter pills: [All] [Category 1] [Category 2] ...
- Active state: Dark bg, white text
- Inactive: White bg, gray text, border

**Customer Version (Phase 2):**
- Dropdown filter on mobile
- Checkbox filters on desktop sidebar

**URL State:**
- Filter persists in URL: `?category=bags`
- Bookmarkable, shareable
- Survives page refresh

---

### 7.3 Product Detail Features

#### 7.3.1 Image Gallery

**Layout:**
- Main image: Large, square or 4:5 aspect ratio
- Thumbnails: Horizontal scroll (mobile), grid (desktop)
- Zoom: Click to expand (Phase 2)

**Image Requirements:**
- Minimum: 800x800px
- Recommended: 1200x1200px
- Format: WebP (primary), JPEG fallback
- Max file size: 500KB per image

**Optimization:**
- Lazy load thumbnails
- Blurhash placeholder for main image
- srcset for responsive loading

---

#### 7.3.2 Product Information

**Required Fields:**
- Name (max 100 chars)
- Price (numeric, NGN currency)
- Description (max 500 chars)
- Category (from predefined or custom)
- Sizes (array of strings)
- Images (1-10 URLs)

**Optional Fields:**
- Original price (for discounts)
- Colors (array)
- Tags (array)
- Featured (boolean)

**Display Logic:**
```typescript
// Price display
{originalPrice && originalPrice > price && (
  <>
    <span class="sale-price">₦{price}</span>
    <span class="original-price">₦{originalPrice}</span>
  </>
)}

// Size selector
{sizes.map(size => (
  <button class={selectedSize === size ? 'active' : ''}>
    {size}
  </button>
))}
```

---

#### 7.3.3 Related Products

**Logic:**
- Same category (priority)
- If no same-category products → random products
- Exclude current product
- Limit: 4 products

**UI:**
- Section title: "You May Also Like"
- Same product card component as listing
- Horizontal scroll on mobile

---

### 7.4 Admin Dashboard Features

#### 7.4.1 Product Management

**CRUD Operations:**

| Action | UI Location | Backend |
|--------|-------------|---------|
| Create | "Add Product" button → Form | POST /api/products |
| Read | Dashboard grid | GET /api/products |
| Update | "Edit" button → Form | PUT /api/products/[id] |
| Delete | Trash icon → Confirm | DELETE /api/products/[id] |
| Feature | Star icon (toggle) | PATCH /api/products/[id]/featured |

**Form Validation:**

| Field | Rules | Error Message |
|-------|-------|---------------|
| Name | Required, 1-100 chars | "Name is required (max 100 characters)" |
| Price | Required, number, ≥0 | "Price must be a positive number" |
| Category | Required, existing or new | "Select or create a category" |
| Sizes | At least 1 | "Add at least one size" |
| Images | 1-10 files, <10MB each, JPG/PNG/WebP | "Upload 1-10 images (max 10MB each)" |

**Success Feedback:**
- Toast notification: "Product created!" / "Product updated!"
- Redirect to dashboard (create) or stay on page (edit)
- Optimistic UI update for star toggle

---

#### 7.4.2 Category Management

**Current Implementation (Dynamic):**
- Categories auto-generated from product data
- No manual category CRUD
- Category color assigned on creation (random from palette)

**Phase 2 Enhancement:**
- Manual category creation/editing
- Category image upload
- Category sorting/ordering
- Category SEO fields (meta title, description)

---

#### 7.4.3 Search & Filter

**Search:**
- Debounced input (300ms)
- Search fields: Name, description
- Case-insensitive
- Highlight matches (Phase 2)

**Filter:**
- Category filter (pills)
- Featured filter (toggle)
- Date range (Phase 2)
- Price range (Phase 2)

**Sort:**
- Newest first (default)
- Price: Low to High
- Price: High to Low
- Name: A-Z

---

### 7.5 Authentication Features

#### 7.5.1 Admin Login

**Flow:**
1. Navigate to `/admin` (or any `/admin/*` route)
2. If no session → Redirect to `/admin/login`
3. Enter credentials (email + password)
4. Validate against environment variables
5. Set `admin_session` cookie (7 days)
6. Redirect to `/admin`

**Security:**
- Credentials stored in `.env.local` (not database)
- Cookie: HttpOnly, Secure, SameSite=Strict
- Rate limiting: 5 attempts per 15 minutes (Phase 2)
- Session invalidation on logout

**Default Credentials:**
```env
ADMIN_EMAIL=admin@bridafripride.com
ADMIN_PASSWORD=bridafripride123  # Change immediately!
```

---

#### 7.5.2 Session Management

**Cookie Details:**
```typescript
{
  name: 'admin_session',
  value: encryptedSessionId,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
}
```

**Middleware Protection:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

---

## 8. Technical Architecture

### 8.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 15.5.12 | React framework, SSR, routing |
| **Language** | TypeScript | 5.x | Type safety, developer experience |
| **UI Library** | React | 19.0.0 | Component framework |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Database** | MongoDB Atlas | M0 Free Tier | NoSQL database |
| **ORM** | Mongoose | 9.2.3 | MongoDB object modeling |
| **Image Hosting** | Cloudinary | Free Tier | CDN, image optimization |
| **Auth** | Custom (cookies) | — | Admin authentication |
| **Notifications** | Sonner | 2.0.7 | Toast notifications |
| **Icons** | Lucide React | 0.563.0 | Icon library |
| **Deployment** | Vercel | — | Hosting, CI/CD |

---

### 8.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js 15 App Router                                │  │
│  │  - Server Components (default)                        │  │
│  │  - Client Components ('use client')                   │  │
│  │  - Server Actions                                     │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    VERCEL EDGE                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Middleware (auth, redirects)                         │  │
│  │  API Routes (/api/*)                                  │  │
│  │  Static Assets (/_next/static)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────────┐ ┌──────────┐ ┌──────────────┐
│  MongoDB Atlas  │ │Cloudinary│ │  Environment │
│  (Database)     │ │  (CDN)   │ │  Variables   │
│  - Products     │ │  - Images│ │  - Secrets   │
│  - Categories   │ │  - Trans-│ │  - Config    │
│  - Sessions     │ │    forms │ │              │
└─────────────────┘ └──────────┘ └──────────────┘
```

---

### 8.3 Data Flow

#### Read Flow (Customer)

```
1. User navigates to /products
2. Next.js renders Server Component
3. Server Component calls getProducts() (Server Action)
4. getProducts() connects to MongoDB
5. MongoDB returns product documents
6. Mongoose serializes to JSON
7. Server Component renders HTML
8. HTML sent to client (TTI: <3s)
9. React hydrates on client
10. Page interactive
```

#### Write Flow (Admin)

```
1. Admin fills product form
2. Clicks "Create Product"
3. Client calls createProduct() (Server Action)
4. Server Action validates input (Zod schema)
5. Uploads images to Cloudinary via /api/upload
6. Cloudinary returns image URLs
7. Creates MongoDB document
8. Returns success/error
9. Client shows toast notification
10. Redirects to /admin
```

---

### 8.4 Database Schema

#### Product Collection

```typescript
interface Product {
  _id: ObjectId;              // MongoDB auto-generated
  name: string;               // Max 100 chars
  description: string;        // Max 500 chars
  price: number;              // Min 0 (NGN)
  originalPrice?: number;     // Optional, for discounts
  category: string;           // Display name
  categorySlug: string;       // URL-friendly slug
  sizes: string[];            // Array of size strings
  colors?: string[];          // Optional color options
  images: string[];           // Cloudinary URLs (1-10)
  featured: boolean;          // Default false
  tags?: string[];            // Optional tags
  createdAt: Date;            // Auto-generated
  updatedAt: Date;            // Auto-updated
}
```

**Indexes:**
```javascript
{
  featured: 1,                // For featured products query
  categorySlug: 1,            // For category filtering
  createdAt: -1,              // For newest-first sorting
  name: 'text',               // For text search (Phase 2)
}
```

---

### 8.5 API Endpoints

#### Public APIs (Customer-Facing)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/products` | GET | List all products | No |
| `/api/products/[id]` | GET | Get single product | No |
| `/api/categories` | GET | List categories | No |

**Example Response (GET /api/products):**
```json
{
  "products": [
    {
      "id": "67e2a1b2c3d4e5f6a7b8c9d0",
      "name": "Classic Leather Tote",
      "price": 299000,
      "originalPrice": 399000,
      "description": "Crafted from premium Italian leather...",
      "category": "Designer Bags",
      "categorySlug": "bags",
      "sizes": ["Small", "Medium", "Large"],
      "colors": ["Black", "Brown", "Navy"],
      "images": [
        "https://res.cloudinary.com/.../product1.jpg"
      ],
      "featured": true,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "updatedAt": "2026-03-25T14:30:00.000Z"
    }
  ],
  "total": 24
}
```

---

#### Admin APIs (Protected)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/products` | POST | Create product | Yes |
| `/api/products/[id]` | PUT | Update product | Yes |
| `/api/products/[id]` | DELETE | Delete product | Yes |
| `/api/products/[id]/featured` | PATCH | Toggle featured | Yes |
| `/api/upload` | POST | Upload image | Yes |
| `/api/auth/login` | POST | Admin login | No |
| `/api/auth/logout` | POST | Admin logout | Yes |

---

### 8.6 Server Actions

#### Product Actions

```typescript
// app/lib/actions/products.ts

export async function getProducts(): Promise<Product[]>
export async function getProductById(id: string): Promise<Product | null>
export async function getFeaturedProducts(): Promise<Product[]>
export async function getProductsByCategory(category: string): Promise<Product[]>

export async function createProduct(data: ProductInput): Promise<{ success: boolean, product?: Product, error?: string }>
export async function updateProduct(id: string, data: ProductInput): Promise<{ success: boolean, error?: string }>
export async function deleteProduct(id: string): Promise<{ success: boolean, error?: string }>
export async function toggleFeaturedProduct(id: string, featured: boolean): Promise<{ success: boolean, error?: string }>
```

#### Auth Actions

```typescript
// app/lib/actions/auth.ts

export async function login(email: string, password: string): Promise<{ success: boolean, error?: string }>
export async function logout(): Promise<void>
export async function getSession(): Promise<Session | null>
```

#### Upload Actions

```typescript
// app/lib/actions/upload.ts

export async function uploadImage(file: File): Promise<{ success: boolean, url?: string, error?: string }>
export async function uploadImages(files: File[]): Promise<{ success: boolean, urls?: string[], error?: string }>
```

---

### 8.7 Performance Optimizations

#### Image Optimization

| Technique | Implementation | Impact |
|-----------|----------------|--------|
| Next.js Image Component | `<Image src={...} fill sizes="..." />` | Auto WebP, lazy loading |
| Cloudinary Transformations | `f_auto,q_auto` in URL | 30-50% file size reduction |
| Blurhash Placeholders | Low-res preview before load | Perceived performance |
| Responsive srcset | `sizes` attribute | Serve appropriate resolution |

#### Caching Strategy

| Resource | Cache Strategy | TTL |
|----------|----------------|-----|
| Static Assets (JS, CSS) | Immutable, CDN | 1 year |
| Product Images | CDN (Cloudinary) | 30 days |
| API Responses | No cache (dynamic) | — |
| MongoDB Connections | Connection pooling | Reuse |

#### Code Splitting

- **Route-based:** Each page is a separate chunk
- **Component-based:** Heavy components lazy-loaded (`next/dynamic`)
- **Library splitting:** Vendor chunks separated from app code

**Example:**
```typescript
// Lazy load newsletter (below fold)
const Newsletter = nextDynamic(() => import('@/app/components/sections/Newsletter'))
```

---

### 8.8 Security Measures

#### Input Validation

```typescript
// Zod schema for product creation
const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  description: z.string().max(500).optional(),
  category: z.string().min(1),
  sizes: z.array(z.string()).min(1),
  images: z.array(z.string().url()).min(1).max(10),
})
```

#### XSS Prevention

- React auto-escapes all JSX output
- No `dangerouslySetInnerHTML` used
- Content Security Policy headers (Phase 2)

#### CSRF Protection

- SameSite=Strict cookies
- Server Actions require POST (not GET)
- Token validation on sensitive actions (Phase 2)

#### Rate Limiting (Phase 2)

- Login: 5 attempts per 15 minutes
- API: 100 requests per minute per IP
- Upload: 10 images per minute

---

## 9. Design System

### 9.1 Color Palette

#### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Neutral Black | `#171717` | Primary text, buttons, headers |
| Neutral White | `#FFFFFF` | Backgrounds, text on dark |
| Amber Accent | `#B45F06` (amber-700) | Active states, highlights, links |
| Amber Light | `#FEF3C7` (amber-100) | Hover states, backgrounds |

#### Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FAFAFA` | Subtle backgrounds |
| `neutral-100` | `#F5F5F5` | Cards, sections |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-300` | `#D4D4D4` | Disabled states |
| `neutral-400` | `#A3A3A3` | Placeholder text |
| `neutral-500` | `#737373` | Secondary text |
| `neutral-600` | `#525252` | Body text |
| `neutral-700` | `#404040` | Primary text |
| `neutral-800` | `#262626` | Hover buttons |
| `neutral-900` | `#171717` | Primary buttons, headers |

#### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#16A34A` (green-600) | Success toasts, confirmations |
| Error | `#DC2626` (red-600) | Error states, validation |
| Warning | `#D97706` (amber-600) | Warnings, alerts |
| Info | `#2563EB` (blue-600) | Informational messages |

---

### 9.2 Typography

#### Font Families

| Usage | Font | Weights |
|-------|------|---------|
| Headings | Inter | 600 (SemiBold), 700 (Bold) |
| Body | Inter | 400 (Regular), 500 (Medium) |
| Mono | Geist Mono | 400 (Regular) |

**Font Import:**
```typescript
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

#### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-4xl` | 36px | 700 | 1.2 | Hero headlines |
| `text-3xl` | 30px | 700 | 1.3 | Section titles |
| `text-2xl` | 24px | 700 | 1.3 | Card titles |
| `text-xl` | 20px | 600 | 1.4 | Subheadings |
| `text-lg` | 18px | 600 | 1.5 | Price displays |
| `text-base` | 16px | 400 | 1.5 | Body text |
| `text-sm` | 14px | 500 | 1.5 | Secondary text |
| `text-xs` | 12px | 500 | 1.4 | Captions, labels |

---

### 9.3 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Micro spacing |
| `2` | 8px | Tight spacing |
| `3` | 12px | Compact spacing |
| `4` | 16px | Base unit |
| `5` | 20px | Comfortable spacing |
| `6` | 24px | Section padding |
| `8` | 32px | Large gaps |
| `10` | 40px | Hero spacing |
| `12` | 48px | Section margins |
| `16` | 64px | Large sections |

---

### 9.4 Component Library

#### Buttons

**Primary Button:**
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-neutral-800">
  Shop Now
</button>
```

**Secondary Button:**
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-neutral-900 transition-colors hover:bg-neutral-100">
  Learn More
</button>
```

**Small Button:**
```tsx
<button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50">
  Edit
</button>
```

---

#### Cards

**Product Card:**
```tsx
<article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
  <div className="relative aspect-square bg-neutral-100">
    <Image src={...} alt={...} fill className="object-cover" />
  </div>
  <div className="flex flex-1 flex-col p-4">
    <h3 className="font-semibold text-neutral-900">{product.name}</h3>
    <p className="mt-2 text-lg font-bold text-neutral-900">₦{product.price}</p>
    <Link href={...} className="mt-4 inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
      View <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
</article>
```

**Category Card:**
```tsx
<Link href={...} className="group relative block overflow-hidden rounded-xl bg-neutral-200">
  <div className="relative aspect-[4/3] sm:aspect-[2/1]">
    <Image src={...} alt={...} fill className="object-cover transition-transform group-hover:scale-105" />
    <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
        Shop {category.name} <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  </div>
</Link>
```

---

#### Forms

**Text Input:**
```tsx
<input
  type="text"
  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
  placeholder="Product name"
/>
```

**File Upload:**
```tsx
<div className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-neutral-400">
  <input type="file" multiple accept="image/*" className="hidden" id="upload" />
  <label htmlFor="upload" className="cursor-pointer">
    <Upload className="mx-auto h-8 w-8 text-neutral-400" />
    <p className="mt-2 text-sm text-neutral-600">Drag & drop or click to upload</p>
  </label>
</div>
```

---

### 9.5 Iconography

**Library:** Lucide React  
**Size:** 16px (small), 20px (medium), 24px (large)  
**Stroke Width:** 2px (default)

**Common Icons:**

| Icon | Usage | Size |
|------|-------|------|
| `Menu` | Mobile navigation | 24px |
| `X` | Close buttons | 24px |
| `ArrowRight` | CTAs, links | 16-20px |
| `Plus` | Add actions | 16px |
| `Pencil` | Edit actions | 16px |
| `Trash` | Delete actions | 16px |
| `Star` | Featured toggle | 20px |
| `Filter` | Filter buttons | 16px |
| `Search` | Search inputs | 20px |
| `Upload` | File upload | 32px |
| `AlertCircle` | Error states | 32px |

---

### 9.6 Motion & Animation

#### Transitions

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Color | 100-150ms | `ease` | Hover states |
| Shadow | 200ms | `ease` | Card hover |
| Transform | 300ms | `ease-out` | Scale, rotate |
| Opacity | 200ms | `ease` | Fade in/out |

**Example:**
```css
.transition-transform duration-300 ease-out
```

#### Keyframe Animations

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

**Slide In (Mobile Nav):**
```css
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in {
  animation: slideIn 300ms ease-out;
}
```

---

## 10. Success Metrics

### 10.1 Key Performance Indicators (KPIs)

#### Customer-Facing Metrics

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Page Load Time (LCP) | <2.5s | Lighthouse, RUM | TBD |
| Time to Interactive (TTI) | <3.5s | Lighthouse | TBD |
| First Input Delay (FID) | <100ms | Chrome UX Report | TBD |
| Bounce Rate | <40% | Google Analytics | TBD |
| Session Duration | >3 minutes | Google Analytics | TBD |
| Pages per Session | >4 | Google Analytics | TBD |
| Conversion Rate | 3.5% | Analytics (Phase 2) | TBD |

---

#### Admin Efficiency Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to Add Product | <2 minutes | Time tracking |
| Admin Task Success Rate | >95% | Error logs |
| Session Duration (Admin) | 10-30 min/session | Analytics |
| Products Added per Week | 20-50 | Database count |

---

### 10.2 User Satisfaction Metrics

#### Customer Satisfaction (CSAT)

**Survey Question (Phase 2):**
> "How satisfied are you with your shopping experience today?"  
> Scale: 1 (Very Dissatisfied) to 5 (Very Satisfied)

**Target:** >4.2 average

---

#### Net Promoter Score (NPS)

**Survey Question (Phase 2):**
> "How likely are you to recommend BridAfriPride Design to a friend or colleague?"  
> Scale: 0 (Not at all likely) to 10 (Extremely likely)

**Calculation:** % Promoters (9-10) - % Detractors (0-6)  
**Target:** >50

---

### 10.3 Technical Health Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Uptime | >99.9% | Vercel Analytics |
| Error Rate | <0.1% | Sentry (Phase 2) |
| API Response Time (p95) | <500ms | Vercel Analytics |
| MongoDB Query Time (p95) | <200ms | MongoDB Atlas |
| Image Load Time | <1s | Lighthouse |

---

### 10.4 Business Metrics

| Metric | Target (12 months) | Current |
|--------|-------------------|---------|
| Monthly Active Users | 50,000 | TBD |
| Product Catalog Size | 500 SKUs | TBD |
| Email Subscribers | 5,000 | TBD |
| Social Media Followers | 10,000 (Instagram) | TBD |
| Return Customer Rate | 30% | TBD |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **SKU** | Stock Keeping Unit - unique product identifier |
| **SSR** | Server-Side Rendering - rendering React on the server |
| **Server Component** | Next.js component that renders on the server only |
| **Client Component** | Next.js component that hydrates on the client |
| **Server Action** | Async function that runs on the server, callable from client |
| **Featured Product** | Product manually highlighted by admin for promotion |
| **Category Slug** | URL-friendly version of category name (e.g., "designer-bags") |
| **Optimistic UI** | UI updates immediately, before server confirmation |
| **LCP** | Largest Contentful Paint - Core Web Vital metric |
| **TTI** | Time to Interactive - when page becomes fully interactive |

---

## Appendix B: References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Deployment](https://vercel.com/docs)

---

## Appendix C: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 25, 2026 | Product Team | Initial specification |

---

**Document End**

*This specification is a living document and will be updated as the product evolves.*
