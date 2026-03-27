# Implementation Plan: Admin Dashboard Redesign

## Overview

Rebuild the admin dashboard with a card-based UI for products and categories. Introduces a Category Mongoose model, new CRUD API routes, shared admin components, multi-image Cloudinary uploads, URL-synced search, optimistic featured toggling, and toast notifications via `sonner`.

## Tasks

- [x] 1. Install dependencies
  - Run `npm install sonner` and `npm install --save-dev fast-check`
  - Verify both packages appear in `package.json`
  - _Requirements: 5.3, design testing strategy_

- [x] 2. Create Category Mongoose model
  - [x] 2.1 Create `app/models/Category.ts` with `ICategory` interface and schema
    - Fields: `name` (String, required, trim), `slug` (String, required, unique, lowercase, validated against `/^[a-z0-9-]+$/`), `description` (String, optional), `color` (String, required, validated against `/^#[0-9a-fA-F]{6}$/`), `image` (String, optional), `timestamps: true`
    - Add indexes on `slug` (unique) and `name`
    - _Requirements: 12.1_

  - [x] 2.2 Write property test for Category model required-field validation (Property 17)
    - **Property 17: Category model enforces required fields**
    - **Validates: Requirements 12.1**
    - Use `fc.record` with required fields omitted; assert Mongoose throws `ValidationError`

- [x] 3. Create API routes — categories and products/[id]
  - [x] 3.1 Create `app/api/categories/route.ts` — GET (list sorted by name) and POST (admin-protected create)
    - GET returns `{ success: true, data: { categories, count } }`
    - POST validates body, calls `Category.create()`, returns 201
    - _Requirements: 12.2, 12.3_

  - [x] 3.2 Create `app/api/categories/[id]/route.ts` — GET, PUT (admin-protected), DELETE (admin-protected)
    - GET returns 404 if not found
    - PUT uses `findByIdAndUpdate` with `{ new: true, runValidators: true }`
    - DELETE removes category only; products retain their `category`/`categorySlug` fields
    - _Requirements: 12.4, 12.5, 12.6, 12.7_

  - [x] 3.3 Create `app/api/products/[id]/route.ts` — GET, PUT (admin-protected), DELETE (admin-protected)
    - GET returns single product by ID, 404 if not found
    - PUT uses `findByIdAndUpdate` with `{ new: true, runValidators: true }`
    - DELETE removes product, returns 200 with success message
    - _Requirements: 4.6, 4.7, 4.8_

  - [x] 3.4 Create `app/api/products/[id]/featured/route.ts` — PATCH (admin-protected)
    - Accepts `{ featured: boolean }` body
    - Updates product's `featured` field, returns updated product
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.5 Write property tests for Category CRUD round-trip (Properties 18–22)
    - **Property 18: Category CRUD round-trip** — Validates: Requirements 12.3, 12.4
    - **Property 19: GET /api/categories returns categories sorted by name** — Validates: Requirements 12.2
    - **Property 20: PUT /api/categories/[id] persists updates** — Validates: Requirements 12.5
    - **Property 21: DELETE /api/categories/[id] removes the category** — Validates: Requirements 12.6
    - **Property 22: Category deletion does not affect products** — Validates: Requirements 12.7

- [x] 4. Update `src/lib/api.ts` with categories support
  - [x] 4.1 Add `CategoryModel` and `CategoryInput` interfaces to `src/lib/api.ts`
    - `CategoryModel`: `_id`, `name`, `slug`, `description?`, `color`, `image?`, `createdAt`, `updatedAt`
    - `CategoryInput`: `name`, `slug`, `description?`, `color`, `image?`
    - _Requirements: 12.1_

  - [x] 4.2 Add `categoriesApi` export to `src/lib/api.ts`
    - Methods: `getAll`, `getById`, `create`, `update`, `delete` — all using the existing `apiRequest` helper
    - _Requirements: 9.1, 11.1, 12.2–12.6_

- [x] 5. Create shared admin components
  - [x] 5.1 Create `app/admin/components/ProductGridSkeleton.tsx`
    - Renders exactly 6 skeleton cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    - Each card: `animate-pulse` placeholder for `aspect-square` image, badge, name, price using `bg-neutral-200`
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 5.2 Write unit test for ProductGridSkeleton renders exactly 6 cards
    - Assert rendered skeleton card count equals 6
    - _Requirements: 6.1_

  - [x] 5.3 Create `app/admin/components/FeaturedToggle.tsx`
    - Props: `productId`, `initialFeatured`, `onSuccess?`
    - Optimistic state flip on click; PATCH `/api/products/[id]/featured`; revert + error toast on failure; success toast on success
    - Filled amber star (`text-amber-500`) when featured, outline star (`text-neutral-300`) when not
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 5.4 Write property test for FeaturedToggle icon variant (Property 6)
    - **Property 6: FeaturedToggle renders correct icon variant for any boolean**
    - **Validates: Requirements 5.1**
    - Use `fc.boolean()` to drive `initialFeatured`; assert correct icon class

  - [x] 5.5 Create `app/admin/components/AdminProductSearch.tsx`
    - Props: `defaultValue?`
    - Debounces input 300ms before `router.push(?search=...)`; removes param when cleared
    - Shows `animate-pulse` progress bar strip while `useTransition` isPending
    - _Requirements: 3.1, 3.3, 3.4_

  - [x] 5.6 Create `app/admin/components/ImageUpload.tsx`
    - Props: `value: string[]`, `onChange: (urls: string[]) => void`, `maxFiles?: number` (default 10)
    - Accepts drag-and-drop and click-to-select; validates type (jpg/png/webp) and size (≤10MB) inline
    - Stores `pendingFiles: File[]` and `previews: string[]` (blob URLs); upload happens on form submit via `onChange`
    - Shows remove (`×`) button per preview; shows inline errors for invalid files
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

  - [x] 5.7 Write property test for file validation (Properties 11–12)
    - **Property 11: File validation rejects oversized and invalid-type files** — Validates: Requirements 8.5, 8.6
    - **Property 12: Removing a file from pending list excludes it** — Validates: Requirements 8.3

  - [x] 5.8 Create `app/admin/components/ProductCard.tsx`
    - Props: `product: Product`, `onDelete: (id: string) => void`, `onFeaturedChange: (id: string, featured: boolean) => void`
    - `next/image` with `fill` + `object-cover` in `aspect-square rounded-t-xl`; `scale-105` on hover
    - Category badge with deterministic color via `getCategoryColor(name)` (export helper from this file or a shared utils file)
    - Name (`truncate`), price `₦{price.toLocaleString()}`, original price struck through if present
    - FeaturedToggle overlay top-right; edit button → `/admin/products/[id]/edit`; delete button → confirmation dialog → `onDelete`
    - Card: `rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 13.1, 13.2_

  - [x] 5.9 Write property tests for ProductCard utilities (Properties 3–5)
    - **Property 3: Client-side search filter is case-insensitive substring match** — Validates: Requirements 3.2
    - **Property 4: Category color mapping is deterministic and bounded** — Validates: Requirements 4.3
    - **Property 5: Price formatting always includes currency symbol and localized number** — Validates: Requirements 4.4

  - [x] 5.10 Create `app/admin/components/CategoryCard.tsx`
    - Props: `category: CategoryModel`, `productCount: number`, `onDelete: (id: string) => void`
    - `next/image` with `fill` + `object-cover` in `aspect-video`; neutral placeholder if no image
    - Color dot using `category.color`; name; slug prefixed with `/`; product count ("N products")
    - "View Products" → `/admin/products?category={slug}`; edit → `/admin/categories/[id]/edit`; delete → confirmation dialog → `onDelete`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 13.1, 13.2_

  - [x] 5.11 Write property tests for CategoryCard (Properties 13–15)
    - **Property 13: Category grid renders one card per category** — Validates: Requirements 9.2
    - **Property 14: Category card image fallback** — Validates: Requirements 10.1
    - **Property 15: Category slug display is prefixed with "/"** — Validates: Requirements 10.3

- [x] 6. Rebuild products page
  - [x] 6.1 Rewrite `app/admin/products/page.tsx` as a client component
    - Fetch `GET /api/products?limit=200` on mount; derive category pills from unique `categorySlug` values
    - Render page header: title, subtitle, `AdminProductSearch`, "Add Product" link → `/admin/products/new`
    - Sticky `Category_Filter_Bar`: "All" pill + one pill per unique category; active pill `bg-neutral-900 text-white`, others neutral outline
    - Read `?search=` and `?category=` from URL on mount; client-side filter products by both
    - Loading → `ProductGridSkeleton`; error → red-tinted card + retry button; empty → dashed border + package icon
    - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` of `ProductCard` components
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.2_

  - [x] 6.2 Write property tests for products page filtering (Properties 1–2)
    - **Property 1: Product grid renders one card per product** — Validates: Requirements 2.1
    - **Property 2: Category filter pills derived from products** — Validates: Requirements 2.3

- [x] 7. Create product form pages (new + edit)
  - [x] 7.1 Create `app/admin/products/new/page.tsx`
    - Client component; form fields: name, price, originalPrice, description, category dropdown (from `categoriesApi.getAll`), tags chip input with Enter-to-add + `×`-to-remove + quick-add buttons, features textarea (one per line), colors (comma-separated), sizes (comma-separated), featured checkbox
    - `ImageUpload` component for multi-image upload; on submit: upload images via `/api/upload/multiple`, then POST to `/api/products`
    - Inline validation errors for missing required fields (name, price, description, category); no API call if invalid
    - On success: success toast + redirect to `/admin/products`; on failure: error toast, stay on page
    - Submit button disabled + loading indicator while uploading/submitting
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.12, 8.1, 8.4, 8.7_

  - [x] 7.2 Create `app/admin/products/[id]/edit/page.tsx`
    - Same form as new; on mount fetch `GET /api/products/[id]` and pre-populate all fields
    - On submit: upload any new images, then PUT to `/api/products/[id]`
    - On success: success toast + redirect to `/admin/products`; on failure: error toast, stay on page
    - _Requirements: 7.1, 7.2, 7.11, 7.12_

  - [x] 7.3 Write property tests for product form (Properties 7–10)
    - **Property 7: Form pre-population matches source data** — Validates: Requirements 7.2, 11.2
    - **Property 8: Tag list mutation correctness** — Validates: Requirements 7.5
    - **Property 9: Input string parsing (features, colors, sizes)** — Validates: Requirements 7.6, 7.7
    - **Property 10: Form validation rejects missing required fields** — Validates: Requirements 7.9, 11.7

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create categories page
  - [x] 9.1 Create `app/admin/categories/page.tsx` as a client component
    - Fetch `GET /api/categories` on mount
    - Page header: title ("Categories"), subtitle, "Add Category" link → `/admin/categories/new`
    - Loading → skeleton grid; empty → empty state with link to add first category
    - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` of `CategoryCard` components
    - Derive `productCount` per category by counting products with matching `categorySlug` (fetch products separately or pass count from API)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Create category form pages (new + edit)
  - [x] 10.1 Create `app/admin/categories/new/page.tsx`
    - Client component; fields: name (required), slug (required, auto-generated from name unless manually edited), description (optional), color picker (required, hex), image upload via `/api/upload/single`
    - `generateSlug(name)` converts to lowercase, replaces spaces/special chars with hyphens, strips leading/trailing hyphens
    - Inline validation errors for missing required fields; no API call if invalid
    - On success: success toast + redirect to `/admin/categories`; on failure: error toast, stay on page
    - _Requirements: 11.1, 11.3, 11.4, 11.5, 11.7, 11.8, 11.9_

  - [x] 10.2 Create `app/admin/categories/[id]/edit/page.tsx`
    - Same form as new; on mount fetch `GET /api/categories/[id]` and pre-populate all fields
    - Show "Quick-select from product images" section: fetch products with matching `categorySlug`, display thumbnails, clicking one sets the category image without re-uploading
    - On submit: PUT to `/api/categories/[id]`
    - On success: success toast + redirect to `/admin/categories`; on failure: error toast, stay on page
    - _Requirements: 11.1, 11.2, 11.6, 11.8, 11.9_

  - [x] 10.3 Write property test for slug generation (Property 16)
    - **Property 16: Slug auto-generation produces URL-safe lowercase strings**
    - **Validates: Requirements 11.4**
    - Use `fc.string()` as input; assert output matches `/^[a-z0-9-]*$/`, is lowercase, has no leading/trailing hyphens

- [x] 11. Update admin layout
  - [x] 11.1 Add `Categories` nav item to `navItems` array in `app/admin/layout.tsx`
    - Insert `{ name: "Categories", href: "/admin/categories", icon: FolderOpen }` (or `Tag` from lucide-react) into the `navItems` array
    - Import the chosen icon from `lucide-react` at the top of the file
    - Do NOT restructure or remove any existing sidebar markup, styles, or behavior
    - _Requirements: 1.1_

  - [x] 11.2 Add `<Toaster />` from `sonner` to `app/admin/layout.tsx`
    - Import `{ Toaster }` from `'sonner'`
    - Render `<Toaster />` inside the layout return, outside the sidebar/main structure (e.g., as a sibling before the closing fragment)
    - _Requirements: 5.3, 4.8, 4.9_

  - [x] 11.3 Update `app/admin/page.tsx` redirect from `/admin/dashboard` to `/admin/products`
    - Change the `redirect('/admin/dashboard')` call to `redirect('/admin/products')`
    - _Requirements: 2.2_

  - [x] 11.4 Update main content area styling in `app/admin/layout.tsx`
    - Change `<main className="p-6">` to apply `bg-neutral-50` background and constrain content to `max-w-6xl mx-auto`
    - _Requirements: 1.2, 1.3, 1.4_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The sidebar in `app/admin/layout.tsx` must NOT be restructured — only `navItems` and `<Toaster />` additions are permitted
- Property tests use `fast-check` with `numRuns: 100`; each test must include the comment `// Feature: admin-dashboard-redesign, Property {N}: {property_text}`
- `getCategoryColor(name)` uses `name.charCodeAt(0) % 8` against the fixed 8-color palette — export it from a shared location (e.g., `app/admin/components/ProductCard.tsx` or a new `app/admin/utils/categoryColors.ts`)
- `generateSlug(name)` should be exported from a shared location (e.g., `app/admin/utils/slugGeneration.ts`) so both category form pages and property tests can import it
